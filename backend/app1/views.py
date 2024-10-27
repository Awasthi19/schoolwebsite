from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
import jwt, datetime
from django.contrib.auth.hashers import make_password, check_password
from .models import *
from django.conf import settings
from django.db.models import Sum, Min, Max, Count
from rest_framework import status

import decimal
from fuzzywuzzy import process
from django.utils.dateformat import format
from .test2 import bs_to_ad, ad_to_bs, get_days_in_bs_month, get_ad_date_range_for_bs_month, bs_date_now
import json
from datetime import datetime, timedelta
from django.utils import timezone
from django.conf import settings
from django.shortcuts import render



class StudentRegistrationView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        # Extract data from the request
        data = request.data
        student_fields = [
            'student_id', 'registration_date', 'student_name', 'local_address',
            'permanent_address', 'mobile_number', 'bus_status', 'student_type', 
            'local_guardian', 'gender', 'mother_name', 'father_name', 
            'dob', 'class_name', 'semester', 'stream'
        ]

        student_data = {field: data.get(field) for field in student_fields}
        student = Student(**student_data)
        student.save()

        # Create registration charges if provided
        registration_charges = data.get('registration_charges', [])
        if registration_charges:
            self.create_student_registration_charges(student, registration_charges)

        return Response({'success': 'Student registered successfully'})

    def create_student_registration_charges(self, student, charges):
        for charge in charges:
            AdministrativeCharge.objects.create(
                student=student,
                description=charge['description'],
                charge=charge['charge'],
                received_amount=0,  # Initially no payment received
                paid=False  # Initially unpaid
            )


class LoadChargesView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        class_name = request.GET.get('className')
        semester = request.GET.get('semester')
        stream = request.GET.get('stream')

        # Filter based on class, and if class is "Diploma", filter by semester and stream as well
        if class_name == 'Diploma':
            fees = RegisterFees.objects.filter(class_name=class_name, semester=semester, stream=stream).first()
        else:
            fees = RegisterFees.objects.filter(class_name=class_name).first()

        if fees:
            charges = {
                'admission_fee': fees.admission_fee,
                'tuition_fee': fees.tuition_fee,
                'library_fee': fees.library_fee,
                'computer_lab_fee': fees.computer_lab_fee,
                'sports_fee': fees.sports_fee,
                'examination_fee': fees.examination_fee,
                'stationery_fee': fees.stationery_fee,
                'transportation_fee': fees.transportation_fee,
                'miscellaneous_fee': fees.miscellaneous_fee,
            }
        else:
            charges = {}

        return Response(charges)


class StudentSearchView(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        student_id_query = request.GET.get('studentIDQuery')
        student_name_query = request.GET.get('studentNameQuery')
        results = []

        if student_id_query:
            students = Student.objects.filter(student_id__icontains=student_id_query)
            results.extend(students)

        if student_name_query:
            students = Student.objects.filter(student_name__icontains=student_name_query)
            results.extend(students)

        # Remove duplicates by using a set
        results = list(set(results))

        # Prepare the data for the response with camelCase keys
        data = self.prepare_student_data(results)
        return Response(data)

    def prepare_student_data(self, students):
        return [{
            "studentID": student.student_id,
            "registrationDate": ad_to_bs(student.registration_date) if student.registration_date else None,
            "studentName": student.student_name,
            "grade": student.class_name,
            "section": student.stream,
            "localAddress": student.local_address,
            "permanentAddress": student.permanent_address,
            "mobileNumber": student.mobile_number,
            "busStatus": student.bus_status,
            "studentType": student.student_type,
            "localGuardian": student.local_guardian,
            "gender": student.gender,
            "motherName": student.mother_name,
            "fatherName": student.father_name,
            "dob": ad_to_bs(student.dob) if student.dob else None,
        } for student in students]


class AdministrativeChargePaymentView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        student_no = request.data.get('studentID')
        received_amount = decimal.Decimal(request.data.get('receivedAmount'))

        try:
            student = Student.objects.get(student_number=student_no)
        except Student.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

        unpaid_charges = AdministrativeCharge.objects.filter(student=student, paid=False).order_by('charge_date')
        remaining_amount = self.process_payment(unpaid_charges, received_amount)

        return Response({'success': 'Payment recorded successfully', 'remaining_amount': remaining_amount},
                        status=status.HTTP_200_OK)

    def process_payment(self, unpaid_charges, received_amount):
        remaining_amount = received_amount

        for charge in unpaid_charges:
            amount_to_pay = charge.charge - charge.received_amount
            if remaining_amount >= amount_to_pay:
                remaining_amount -= amount_to_pay
                charge.paid = True
                charge.received_amount = charge.charge  # Fully paid
            else:
                charge.received_amount += remaining_amount
                remaining_amount = 0
            charge.save()

        return remaining_amount


class StudentEditView(APIView):
    permission_classes = []
    authentication_classes = []

    def patch(self, request):
        student = get_object_or_404(Student, student_number=request.data['studentNumber'])

        update_fields = ['studentID', 'studentName', 'grade', 'section', 'localAddress',
                         'permanentAddress', 'mobileNumber', 'busStatus', 'studentType', 'localGuardian', 'gender',
                         'motherName', 'fatherName', 'grandFatherName', 'dob']

        for field in update_fields:
            if field in request.data:
                setattr(student, field.lower(), request.data.get(field))

        student.save()

        charges = request.data.get('editCharges')
        if charges:
            self.add_charges(student, charges)

        return Response({'success': 'Student details updated successfully'}, status=status.HTTP_200_OK)

    def add_charges(self, student, charges):
        for charge in charges:
            AdministrativeCharge.objects.create(
                student=student,
                description=charge['description'],
                charge=charge['charge'],
                received_amount=0,
                paid=False
            )


class DeleteStudentView(APIView):
    permission_classes = []
    authentication_classes = []

    def delete(self, request):
        student_no = request.data.get('studentID')
        if not student_no:
            return Response({'error': 'Student number is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            student = Student.objects.get(student_number=student_no)
        except Student.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

        student.delete()
        return Response({'success': 'Student deleted successfully'}, status=status.HTTP_200_OK)


class BillingReportView(APIView):
    def get(self, request):
        # Retrieve 'start_date' and 'end_date' from the request
        start_date = request.GET.get('date_range[startDate]')
        end_date = request.GET.get('date_range[endDate]')

        # Initialize date objects
        start_date_ad = end_date_ad = None
        start_date_obj = end_date_obj = None

        if start_date:
            parts = start_date.split('-')

            if len(parts) == 2:  # Format 'YYYY-MM'
                start_date_ad, end_date_ad = get_ad_date_range_for_bs_month(int(parts[0]), int(parts[1]))
                end_date_obj = datetime.strptime(end_date_ad.strftime('%Y-%m-%d'), '%Y-%m-%d')
            else:
                start_date_ad = bs_to_ad(start_date)

            start_date_obj = datetime.strptime(start_date_ad.strftime('%Y-%m-%d'), '%Y-%m-%d')

        if end_date:
            end_date_ad = bs_to_ad(end_date)
            end_date_obj = datetime.strptime(end_date_ad.strftime('%Y-%m-%d'), '%Y-%m-%d')

        # Query filtering based on the provided date range
        fees = StudentAccount.objects.all()

        if start_date_obj and not end_date_obj:
            fees = fees.filter(paid_date__date=start_date_obj.date())
        elif start_date_obj and end_date_obj:
            fees = fees.filter(paid_date__date__gte=start_date_obj.date(),
                               paid_date__date__lte=end_date_obj.date())

        # Prepare fee data for the response
        fees_data = [
            {
                'paid_date': fee.paid_date,
                'payment_status': fee.payment_status,
                'paid_amount': fee.paid_amount,
                'year': fee.year,
                'month': fee.month,
                'remarks': fee.remarks,
                'student_name': fee.student.student_name,
                'student_id': fee.student.student_id,
            }
            for fee in fees
        ]

        total_charges = fees.aggregate(Sum('paid_amount'))['paid_amount__sum'] or 0

        # Return response
        return Response({
            'fees_data': fees_data,
            'total_charges': total_charges,
        })


class PayView(APIView):
    def post(self, request):
        student_id = request.data.get('studentID')
        description = 'description'
        received_amount = decimal.Decimal(request.data.get('amountReceived', 0))
        entry_by = request.data.get('entryBy')

        # Fetch student object
        try:
            student = Student.objects.get(student_id=student_id)
        except Student.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

        # Get last ledger entry and calculate balance
        last_ledger_entry = LedgerEntry.objects.filter(student=student).order_by('-date').first()
        balance = last_ledger_entry.balance - received_amount if last_ledger_entry else -received_amount
        # Get the grade fee and calculate the 20% threshold
        grade_fee = student.grade.fee
        threshold = 0.2 * grade_fee

        # If the balance exceeds 20% of the grade fee, create future StudentAccount records
        while balance > threshold:
            bs_day, bs_month, bs_year = bs_date_now()

            # Adjust the month and year if bs_month is 12
            if bs_month == 12:
                next_bs_month = 1
                next_bs_year = bs_year + 1
            else:
                next_bs_month = bs_month + 1
                next_bs_year = bs_year

            # Create a StudentAccount record for the upcoming month
            StudentAccount.objects.create(
                student=student,
                month=next_bs_month,
                year=next_bs_year,
                charges=grade_fee,
                paid=False,
                upload_date=timezone.now()
            )
            # Debit the balance with the grade fee
            balance -= grade_fee

            LedgerEntry.objects.create(
                student=student,
                date=timezone.now(),
                description=description,
                entry_by=entry_by,
                debit=grade_fee,
                balance=balance,
                remarks=receipt_number
            )
        # Get or create the current fiscal year record
        fiscal_year_record = FiscalYearRecord.get_or_create_current_fiscal_year()
        receipt_number = fiscal_year_record.increment_receipt_count()

        # Create new ledger entry
        LedgerEntry.objects.create(
            student=student,
            date=timezone.now(),
            description=description,
            entry_by=entry_by,
            credit=received_amount,
            balance=balance,
            remarks=receipt_number
        )

        # Handle dues payment
        pending_dues = StudentAccount.objects.filter(student=student, paid=False).order_by('upload_date')
        remaining_amount = received_amount

        for due in pending_dues:
            amount_to_pay = due.charges - due.paid_amount

            if remaining_amount >= amount_to_pay:
                remaining_amount -= amount_to_pay
                due.paid = True
                due.paid_amount = due.charges
            else:
                due.paid_amount += remaining_amount
                remaining_amount = 0

            due.paid_date = timezone.now()
            due.save()

            if remaining_amount == 0:
                break

        return Response({
            'success': 'Payment recorded successfully',
            'receipt_count': receipt_number,
            'remaining_amount': remaining_amount,
        }, status=status.HTTP_201_CREATED)


class LoadPaymentView(APIView):
    def get(self, request):
        student_id = request.GET.get('studentID')
        student = Student.objects.get(student_id=student_id)

        if not student:
            return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)

        last_ledger_entry = LedgerEntry.objects.filter(student=student).order_by('-date').first()
        last_credit_entry = LedgerEntry.objects.filter(student=student, credit__isnull=False).order_by('-date').first()
        print(last_ledger_entry.balance, last_credit_entry.balance)
        if not last_ledger_entry or not last_credit_entry:
            return Response({"error": "No ledger entries found for this student."}, status=status.HTTP_404_NOT_FOUND)

        advance_amount = last_credit_entry.balance if last_ledger_entry != last_credit_entry else 0
        total_amount = last_ledger_entry.balance
        to_pay = total_amount - advance_amount

        return Response({
            "total_amount": total_amount,
            "advance_amount": advance_amount,
            "to_pay": to_pay,
        }, status=status.HTTP_200_OK)


class StudentLedgerView(APIView): 
    def get(self, request): 
        student_id = request.GET.get('studentID')
        selected_year = request.GET.get('selectedYear', 'All')

        try:
            student = Student.objects.get(student_id=student_id)
        except Student.DoesNotExist:
            return Response({"error": "Student not found"}, status=404)


        payments = LedgerEntry.objects.filter(student=student).order_by('date')

        # Prepare the payment data for the response
        payment_data = []
        for payment in payments:
            payment_data.append({
                'date': payment.date,
                'description': payment.description,
                'entryBy': payment.entry_by,
                'debit': payment.debit,
                'credit': payment.credit,
                'balance': payment.balance,
                'remarks': payment.remarks,
            })
        
        # Calculate total debit, credit, and balance for the selected period
        total_debit = payments.aggregate(Sum('debit'))['debit__sum'] or 0
        total_credit = payments.aggregate(Sum('credit'))['credit__sum'] or 0
        current_balance = payments.last().balance if payments.exists() else 0
        
        # Send the response with payment data and totals
        return Response({
            'payments': payment_data,
            'total_debit': total_debit,
            'total_credit': total_credit,
            'current_balance': current_balance,
        })


class StudentAccountView(APIView):
    def get(self, request):
        student_id = request.GET.get('studentID')
        selected_year = request.GET.get('selectedYear', 'All')

        # Validate if student exists
        try:
            student = Student.objects.get(student_id=student_id)
        except Student.DoesNotExist:
            return Response({"error": "Student not found"}, status=404)

        student_accounts = StudentAccount.objects.filter(student=student).order_by('fee_recorded_date')

        # Prepare the student account data for the response
        account_data = []
        for account in student_accounts:
            account_data.append({
                'year': account.year,
                'month': account.month,
                'paid_amount': account.paid_amount,
                'paid_date': account.paid_date,
                'charge': account.charge,
                'payment_status': account.payment_status,
                'fee_recorded_date': account.fee_recorded_date,
                'remarks': account.remarks,
            })

        # Calculate total paid amount and total due for the selected period
        total_paid = student_accounts.aggregate(Sum('paid_amount'))['paid_amount__sum'] or 0

        # Send the response with student account data and totals
        return Response({
            'student_accounts': account_data,
            'total_paid': total_paid,
            
        })



""" Viewed Later """




class BSADMappingView(APIView):
    def post(self, request):
        # Initialize a list to hold new objects for bulk creation
        bsad_mappings = []
        
        # Iterate through the request data
        for entry in request.data:
            try:
                # Validate and prepare data for creation
                bsad_mappings.append(
                    BSADMapping(
                        bs_month=entry['bs_month'],
                        bs_year=entry['bs_year'],
                        ad_month_start=datetime.strptime(entry['ad_month_start'], '%Y-%m-%d').date()
                    )
                )
            except KeyError as e:
                return Response(
                    {"error": f"Missing field: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except ValueError as e:
                return Response(
                    {"error": f"Invalid date format: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Bulk create all BSADMapping entries in a single query
        if bsad_mappings:
            BSADMapping.objects.bulk_create(bsad_mappings)

        return Response({"message": "Data successfully created"}, status=status.HTTP_201_CREATED)

class DaysInMonthView(APIView):
    def get(self, request):
        year = request.GET.get('year')
        month = request.GET.get('month')
        days_in_bs_month = get_days_in_bs_month(year, month)
        return Response({'days_in_bs_month': days_in_bs_month})


class loginView (APIView):
    permission_classes = []
    authentication_classes = []
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        try:
            user = User.objects.filter(username=username).first()
        except User.DoesNotExist:
            return Response({'error': 'Invalid username'})
        cp= check_password(password, user.password)
        if cp==False:
            return Response({'error': 'Invalid password'})
        else:
            now=datetime.datetime.now(datetime.timezone.utc)
            expire=now+datetime.timedelta(days=1)
            payload = {
                'username': user.username,
                'exp': expire,
                'iat': now
            }
            token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
            response= Response()
            
            response.data = {
                'message'  : 'login success',
                'jwt': token
            }
            return response
"""        
class signupView (APIView):
    permission_classes = []
    authentication_classes = []
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'username already exists'})
        
        hashed_password = make_password(password)
        print (hashed_password)
        user=User(username=username,password=hashed_password)   
        user.save()
        return Response({'success': 'account created'})   
        
"""

class BulkStudentRegistrationView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        students_data = request.data.get('students', [])
        
        # To keep track of successfully registered students
        registered_students = []
        for student_data in students_data:
            try:
                student = self.create_student(student_data)
                registered_students.append(student.student_no)
                self.create_student_registration_charges(student, student_data)
            except Exception as e:
                # Handle any exception (e.g., validation error)
                return Response({'error': str(e)}, status=400)

        return Response({'success': 'All students registered', 'student_numbers': registered_students})

    def create_student(self, student_data):
        student_ID = student_data.get('studentID')
        registration_date = student_data.get('registrationDate')
        student_name = student_data.get('studentName')
        grade = student_data.get('grade')
        section = student_data.get('section')
        local_address = student_data.get('localAddress')
        permanent_address = student_data.get('permanentAddress')
        mobile_number = student_data.get('mobileNumber')
        bus_status = student_data.get('busStatus')
        student_type = student_data.get('studentType')
        local_guardian = student_data.get('localGuardian')
        received_amount = student_data.get('receivedAmount')
        registration_charges = student_data.get('registrationCharges', [])

        gender = student_data.get('gender')
        mother_name = student_data.get('motherName')
        father_name = student_data.get('fatherName')
        grand_father_name = student_data.get('grandFatherName')
        dob = student_data.get('dob')


        # Create the student object
        student = Student(
            student_number=student_ID,
            registration_date=registration_date,
            student_name_english=student_name,
            grade=grade,
            section=section,
            local_address=local_address,
            permanent_address=permanent_address,
            mobile_number=mobile_number,
            bus_status=bus_status,
            student_type=student_type,
            local_guardian=local_guardian,
            received_amount=received_amount,
            gender=gender,
            mother_name=mother_name,
            father_name=father_name,
            grand_father_name=grand_father_name,
            dob=dob
        )

        # Save the student to the database
        student.save()


        return student

    def create_student_registration_charges(self, student, student_data):
        registration_charges = student_data.get('registration_charges', [])
        for charge in registration_charges:
            AdministrativeCharge.objects.create(
                student=student,
                description=charge['description'],
                charge=charge['charge'],
                received_amount=0,  # Initially no payment received
                paid=False  # Initially unpaid
            )

class PaybulkView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        payments = request.data.get('payments')  # Assuming data is sent as a list

        if not payments:
            return Response({'error': 'No payment data provided'}, status=status.HTTP_400_BAD_REQUEST)

        for payment in payments:
            student_no = payment.get('studentNumber')
            date = datetime.datetime.now()
            description = payment.get('description')
            entry_by = payment.get('entryBy')
            debit = payment.get('debit')
            credit = payment.get('credit')
            balance = payment.get('balance')
            remarks = payment.get('remarks')

            try:
                student = student.objects.get(student_no=student_no)
            except student.DoesNotExist:
                return Response({'error': 'student not found'}, status=status.HTTP_404_NOT_FOUND)

            payment_obj = LedgerEntry(
                student=student,
                date=date,
                description=description,
                entry_by=entry_by,
                debit=debit,
                credit=credit,
                balance=balance,
                remarks=remarks,
            )
            payment_obj.save()

        return Response({'success': 'Payments recorded successfully'}, status=status.HTTP_201_CREATED)


class RegisterFeesView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        print("hello")
        try:
            data = request.data 

            fee_entry = RegisterFees(
                class_name=data.get('className'),
                semester=data.get('semester', None), 
                stream=data.get('stream', None),  
                admission_fee=data['fees'].get('Admission', 0),
                tuition_fee=data['fees'].get('Tuition', 0),
                library_fee=data['fees'].get('Library', 0),
                computer_lab_fee=data['fees'].get('ComputerLab', 0),
                sports_fee=data['fees'].get('Sports', 0),
                examination_fee=data['fees'].get('Examination', 0),
                stationery_fee=data['fees'].get('Stationery', 0),
                transportation_fee=data['fees'].get('Transportation', 0),
                miscellaneous_fee=data['fees'].get('Misc', 0),
            )

            fee_entry.save()
            return Response({'message': 'Fees registered successfully!'}, status=status.HTTP_201_CREATED)

        except KeyError as e:
            # Handle missing keys gracefully
            return Response({'message': f'Missing field: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GetFeesView(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        print("get fees")
        class_name = request.query_params.get('className')
        semester = request.query_params.get('semester')
        stream = request.query_params.get('stream')
        
        if class_name == 'Diploma':
            fee_entry = RegisterFees.objects.filter(class_name=class_name, semester=semester, stream=stream).first()
        else:
            fee_entry = RegisterFees.objects.filter(class_name=class_name).first()

        try:
            fees_data = {
                'Admission': fee_entry.admission_fee,
                'Tuition': fee_entry.tuition_fee,
                'Library': fee_entry.library_fee,
                'ComputerLab': fee_entry.computer_lab_fee,
                'Sports': fee_entry.sports_fee,
                'Examination': fee_entry.examination_fee,
                'Stationery': fee_entry.stationery_fee,
                'Transportation': fee_entry.transportation_fee,
                'Misc': fee_entry.miscellaneous_fee,
            }
            return Response({'success': True, 'fees': fees_data}, status=status.HTTP_200_OK)
        
        except RegisterFees.DoesNotExist:
            return Response({'success': False, 'message': 'No fee data found for the selected class. Please Register Below'}, status=status.HTTP_404_NOT_FOUND)


class UpdateFeesView(APIView):
    permission_classes = []
    authentication_classes = []

    def put(self, request):
        print("x")
        class_name = request.data.get('className')
        semester = request.data.get('semester')
        stream = request.data.get('stream')
        fees = request.data.get('fees', {})
        
        if class_name == 'Diploma':
            fee_entry = RegisterFees.objects.filter(class_name=class_name, semester=semester, stream=stream).first()
        else:
            fee_entry = RegisterFees.objects.filter(class_name=class_name).first()

        try:
            # Update each fee field
            fee_entry.admission_fee = fees.get('Admission', fee_entry.admission_fee)
            fee_entry.tuition_fee = fees.get('Tuition', fee_entry.tuition_fee)
            fee_entry.library_fee = fees.get('Library', fee_entry.library_fee)
            fee_entry.computer_lab_fee = fees.get('ComputerLab', fee_entry.computer_lab_fee)
            fee_entry.sports_fee = fees.get('Sports', fee_entry.sports_fee)
            fee_entry.examination_fee = fees.get('Examination', fee_entry.examination_fee)
            fee_entry.stationery_fee = fees.get('Stationery', fee_entry.stationery_fee)
            fee_entry.transportation_fee = fees.get('Transportation', fee_entry.transportation_fee)
            fee_entry.miscellaneous_fee = fees.get('Misc', fee_entry.miscellaneous_fee)
            
            fee_entry.save()
            return Response({'message': 'Fees updated successfully!'}, status=status.HTTP_200_OK)
        
        except RegisterFees.DoesNotExist:
            return Response({'message': 'Fee record not found for the specified class.'}, status=status.HTTP_404_NOT_FOUND)


class DueReportView(APIView):
    def get(self, request):
        unpaid_summary = (
            StudentAccount.objects.filter(payment_status=False)
            .values('student__student_id', 'student__student_name')
            .annotate(
                total_due=Sum('charge'), 
                earliest_year_month=Min('year'), 
                latest_year_month=Max('year'),  
                earliest_month=Min('month'),
                latest_month=Max('month'),   
                unpaid_months=Count('id') 
            )
        )

        # Prepare the data for the frontend
        response_data = {
            "fees_data": [
                {
                    "student_id": entry["student__student_id"],
                    "student_name": entry["student__student_name"],
                    "total_due": entry["total_due"],
                    "due_date_range": f"{entry['earliest_year_month']}-{entry['earliest_month']} to {entry['latest_year_month']}-{entry['latest_month']}",
                    "number_of_months": entry["unpaid_months"],
                    "remarks": "Unpaid",
                }
                for entry in unpaid_summary
            ]
        }
        
        return Response(response_data)


class NewsView(APIView):
    def post(self, request):
        """
        Handle news upload with a POST request.
        """
        try:
            data = request.data  # Extract data from the request

            # Create a new news entry
            news_entry = News(
                title=data.get('title'),
                message=data.get('message'),
                file=request.FILES.get('file', None)  # Optional file upload
            )
            news_entry.save()  # Save the news entry

            return Response(
                {'message': 'News uploaded successfully!'},
                status=status.HTTP_201_CREATED
            )

        except KeyError as e:
            # Handle missing fields gracefully
            return Response(
                {'message': f'Missing field: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            # Catch all other exceptions
            return Response(
                {'message': f'An error occurred: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

    def get(self, request):
        """
        Fetch recent news with a GET request.
        """
        try:
            news_entries = News.objects.order_by('-date')[:5]  # Get the 5 most recent news
            news_list = [
                {
                    'id': news.id,
                    'title': news.title,
                    'message': news.message,
                    'date': news.date,
                    'file_url': news.file.url if news.file else None
                }
                for news in news_entries
            ]

            return Response(news_list, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'message': f'An error occurred: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


class StaffView(APIView):

    def get(self, request):
        staff_members = Staff.objects.all()
        staff_data = [
            {
                'id': member.id,
                'name': member.name,
                'description': member.description,
                'photo': request.build_absolute_uri(member.photo.url) if member.photo else None
            }
            for member in staff_members
        ]
        return Response(staff_data, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            name = request.data.get('name')
            description = request.data.get('description')
            photo = request.FILES.get('photo')

            if not name or not description:
                return Response({'success': False, 'error': 'Name and description are required.'}, status=status.HTTP_400_BAD_REQUEST)

            staff_member = Staff(name=name, description=description, photo=photo)
            staff_member.save()

            return Response({'success': True, 'message': 'Staff details uploaded successfully!'}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


import hmac
import hashlib
import base64

def generate_signature(total_amount, transaction_uuid, product_code, secret_key):
    message = f"total_amount={total_amount},transaction_uuid={transaction_uuid},product_code={product_code}"
    hmac_hash = hmac.new(secret_key.encode(), message.encode(), hashlib.sha256).digest()
    return base64.b64encode(hmac_hash).decode()

def EsewaPaymentFunction(request):
    amount = 1000
    tax_amount = 100
    total_amount = amount + tax_amount
    transaction_uuid = datetime.now().strftime("%y%m%d-%H%M%S")
    product_code = "EPAYTEST"
    secret_key = "8gBm/:&EnhH.1/q"
    
    signature = generate_signature(total_amount, transaction_uuid, product_code, secret_key)
    print(signature)

    context = {
        'amount': amount,
        'tax_amount': tax_amount,
        'total_amount': total_amount,
        'transaction_uuid': transaction_uuid,
        'product_code': product_code,
        'product_service_charge': 0,
        'product_delivery_charge': 0,
        'success_url': settings.ESEWA_SUCCESS_URL,
        'failure_url': settings.ESEWA_FAILURE_URL,
        'signed_field_names': "total_amount,transaction_uuid,product_code",
        'signature': signature,
        'secret': secret_key,
    }
    return render(request, 'payment_form.html', context)
