import logging
from django.utils import timezone
from app1.models import Student, StudentAccount, LedgerEntry
from .test2 import bs_date_now


logger = logging.getLogger("django")

def print_hello():
    logger.info('Cron Job Was Called')
    print('Hello, world!')

def generate_student_accounts_and_debit():
    # Define the monthly grade fee
    grade_fee = 1500
    description = 'Monthly Fee'

    # Get the current year and month
    bs_day, bs_month, bs_year = bs_date_now()

    # Adjust the month and year if bs_month is 12
    if bs_month == 12:
        next_bs_month = 1
        next_bs_year = bs_year + 1
    else:
        next_bs_month = bs_month + 1
        next_bs_year = bs_year

    # Get all students
    students = Student.objects.all()

    for student in students:
        # Check if the current month/year record already exists in StudentAccount
        account_exists = StudentAccount.objects.filter(
            student=student, year=bs_year, month=bs_month
        ).exists()

        if account_exists:
            # Create the StudentAccount record for the current month
            StudentAccount.objects.create(
                student=student,
                month=next_bs_month,
                year=next_bs_year,
                charges=grade_fee,
                paid=False,
                upload_date=timezone.now(),
            )

            # Get the student's last ledger entry
            last_ledger_entry = LedgerEntry.objects.filter(student=student).order_by('-date').first()
            previous_balance = last_ledger_entry.balance if last_ledger_entry else 0

            # Calculate the new balance after debiting the grade fee
            new_balance = previous_balance + grade_fee

            # Create a new ledger entry to record the debit
            LedgerEntry.objects.create(
                student=student,
                date=timezone.now(),
                description=description,
                entry_by='System',  # Cron job entry
                debit=grade_fee,
                balance=new_balance,
            )            

        if not account_exists:
            # Create the StudentAccount record for the current month
            StudentAccount.objects.create(
                student=student,
                month=bs_month,
                year=bs_year,
                charges=grade_fee,
                paid=False,
                upload_date=timezone.now(),
            )

            # Get the student's last ledger entry
            last_ledger_entry = LedgerEntry.objects.filter(student=student).order_by('-date').first()
            previous_balance = last_ledger_entry.balance if last_ledger_entry else 0

            # Calculate the new balance after debiting the grade fee
            new_balance = previous_balance + grade_fee

            # Create a new ledger entry to record the debit
            LedgerEntry.objects.create(
                student=student,
                date=timezone.now(),
                description=description,
                entry_by='System',  # Cron job entry
                debit=grade_fee,
                balance=new_balance,
            )

    print("Monthly StudentAccount and LedgerEntry records generated successfully.")

    


