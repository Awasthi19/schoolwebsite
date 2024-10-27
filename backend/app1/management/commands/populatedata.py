from django.core.management.base import BaseCommand
from app1.models import (
 RegisterFees, Student, AdministrativeCharge,
 LedgerEntry, StudentAccount
)
from django.utils import timezone
import datetime
import random

class Command(BaseCommand):
    help = 'Populate the database with sample data.'

    def handle(self, *args, **kwargs):
        # Helper functions for random data
        def random_date(start, end):
            return start + datetime.timedelta(days=random.randint(0, (end - start).days))

        def random_choice(choices):
            return random.choice([c[0] for c in choices])

        today = timezone.now()

        # Populate RegisterFees
        print("Populating RegisterFees...")
        fees_records = [
            RegisterFees(
                class_name=class_name,
                semester=semester,
                stream=stream,
                admission_fee=random.uniform(5000, 15000),
                tuition_fee=random.uniform(2000, 5000),
                library_fee=random.uniform(500, 1000),
                computer_lab_fee=random.uniform(1000, 3000),
                sports_fee=random.uniform(500, 1500),
                examination_fee=random.uniform(800, 2000),
                stationery_fee=random.uniform(200, 500),
                transportation_fee=random.uniform(1000, 3000),
                miscellaneous_fee=random.uniform(300, 1000),
            )
            for class_name, _ in RegisterFees.CLASS_CHOICES
            for semester, _ in RegisterFees.SEMESTER_CHOICES
            for stream, _ in RegisterFees.STREAM_CHOICES
        ]
        RegisterFees.objects.bulk_create(fees_records)

        # Populate Students
        print("Populating Students...")
        students = [
            Student(
                student_id=f'S{i:03}',
                registration_date=random_date(datetime.date(2022, 1, 1), today.date()),
                student_name=f'Student_{i}',
                local_address='Kathmandu',
                permanent_address='Pokhara',
                mobile_number=f'98{random.randint(10000000, 99999999)}',
                bus_status=random.choice(['Yes', 'No']),
                student_type=random.choice(['Regular', 'Scholarship']),
                local_guardian=f'Guardian_{i}',
                received_amount=random.uniform(0, 10000),
                registration_charges={
                    "admission_fee": random.uniform(5000, 15000),
                    "tuition_fee": random.uniform(2000, 5000)
                },
                gender=random.choice(['Male', 'Female', 'Other']),
                mother_name=f'Mother_{i}',
                father_name=f'Father_{i}',
                dob=random_date(datetime.date(2005, 1, 1), datetime.date(2010, 12, 31)),
                roll_number=f'R{i:03}',
                class_name=random_choice(RegisterFees.CLASS_CHOICES),
                semester=random_choice(RegisterFees.SEMESTER_CHOICES),
                stream=random_choice(RegisterFees.STREAM_CHOICES),
            )
            for i in range(1, 21)
        ]
        Student.objects.bulk_create(students)

        # Populate AdministrativeCharge
        print("Populating AdministrativeCharge...")
        charges = [
            AdministrativeCharge(
                student=random.choice(students),
                description=f'Charge_{i}',
                charge=random.uniform(500, 2000),
                received_amount=random.uniform(0, 500),
                paid=random.choice([True, False]),
            )
            for i in range(1, 31)
        ]
        AdministrativeCharge.objects.bulk_create(charges)

        # Populate LedgerEntry
        print("Populating LedgerEntry...")
        ledger_entries = [
            LedgerEntry(
                student=random.choice(students),
                date=random_date(today - datetime.timedelta(days=365), today),
                description=f'Ledger Entry {i}',
                entry_by=f'User_{i}',
                debit=random.uniform(1000, 5000),
                credit=random.uniform(500, 3000),
                balance=random.uniform(0, 7000),
                remarks=f'Remark for entry {i}'
            )
            for i in range(1, 41)
        ]
        LedgerEntry.objects.bulk_create(ledger_entries)

        # Populate StudentAccount
        print("Populating StudentAccount...")
        accounts = [
            StudentAccount(
                student=random.choice(students),
                year=random.choice([2080, 2081, 2082]),
                month=random.choice(['Baisakh', 'Jestha', 'Ashad']),
                paid_date=random_date(today - datetime.timedelta(days=30), today),
                paid_amount=random.uniform(0, 5000),
                payment_status=random.choice([True, False]),
                charge=random.uniform(2000, 5000),
                remarks=f'Remarks for account {i}',
                fee_recorded_date=random_date(today - datetime.timedelta(days=10), today)
            )
            for i in range(1, 21)
        ]
        StudentAccount.objects.bulk_create(accounts)

        print("Data population completed successfully!")
