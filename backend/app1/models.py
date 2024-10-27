from django.db import models
import datetime
from django.utils import timezone

class BSADMapping(models.Model):
    bs_month = models.IntegerField()
    bs_year = models.IntegerField()
    ad_month_start = models.DateField()  # The AD date corresponding to the first day of the BS month

    def __str__(self):
        return f"BS {self.bs_month}/{self.bs_year}"

class User(models.Model):
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=50)
    def __str__(self):
        return self.username


class RegisterFees(models.Model):
    CLASS_CHOICES = [
        ('PG', 'Post Graduate'),
        ('Nursery', 'Nursery'),
        ('LKG', 'LKG'),
        ('UKG', 'UKG'),
    ] + [(f'Class {i}', f'Class {i}') for i in range(1, 13)] + [
        ('Diploma', 'Diploma'),
    ]

    SEMESTER_CHOICES = [(str(i), str(i)) for i in range(1, 7)]  # Semesters 1 to 6
    STREAM_CHOICES = [
        ('Computer Engineering', 'Computer Engineering'),
        ('Agriculture', 'Agriculture'),
        ('Health Assistant', 'Health Assistant'),
        ('Lab Technician', 'Lab Technician'),
        ('Staff Nurse', 'Staff Nurse'),
        ('Civil Engineering', 'Civil Engineering'),
    ]

    class_name = models.CharField(max_length=50, choices=CLASS_CHOICES)
    semester = models.CharField(max_length=10, choices=SEMESTER_CHOICES, blank=True, null=True)
    stream = models.CharField(max_length=100, choices=STREAM_CHOICES, blank=True, null=True)
    
    admission_fee = models.DecimalField(max_digits=10, decimal_places=2,blank=True, null=True)
    tuition_fee = models.DecimalField(max_digits=10, decimal_places=2,blank=True, null=True)
    library_fee = models.DecimalField(max_digits=10, decimal_places=2,blank=True, null=True)
    computer_lab_fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    sports_fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    examination_fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    stationery_fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    transportation_fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    miscellaneous_fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return f"{self.class_name} Fees"



class Student(models.Model):
    student_id = models.CharField(max_length=20, null=True, blank=True)  # StudentNumber
    registration_date = models.DateField(null=True, blank=True)  # registrationDate
    student_name = models.CharField(max_length=100, null=True, blank=True)  # StudentNameEnglish
    local_address = models.CharField(max_length=100, null=True, blank=True)  # localAddress
    permanent_address = models.CharField(max_length=100, null=True, blank=True)  # permanentAddress
    mobile_number = models.CharField(max_length=15, null=True, blank=True)  # mobileNumber
    bus_status = models.CharField(max_length=50, null=True, blank=True)  # busStatus
    student_type = models.CharField(max_length=50, null=True, blank=True)  # StudentType
    local_guardian = models.CharField(max_length=100, null=True, blank=True)  # localGuardian
    received_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # receivedAmount
    registration_charges = models.JSONField(null=True, blank=True)  # registrationCharges
    gender = models.CharField(max_length=10, null=True, blank=True)  # gender
    mother_name = models.CharField(max_length=100, null=True, blank=True)  # motherName
    father_name = models.CharField(max_length=100, null=True, blank=True)  # fatherName
    dob = models.DateField(null=True, blank=True)  # dob
    roll_number = models.CharField(max_length=20, blank=True, null=True)
    class_name = models.CharField(max_length=50, choices=RegisterFees.CLASS_CHOICES, null=True, blank=True)
    semester = models.CharField(max_length=10, choices=RegisterFees.SEMESTER_CHOICES, blank=True, null=True)
    stream = models.CharField(max_length=100, choices=RegisterFees.STREAM_CHOICES, blank=True, null=True)

    def __str__(self):
        return f"{self.student_id} - {self.student_name}"


class AdministrativeCharge(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='other_charges')
    description = models.CharField(max_length=255)
    charge_date = models.DateTimeField(default=timezone.now)
    charge = models.DecimalField(max_digits=10, decimal_places=2)
    received_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    paid = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.description} - {self.charge}"
    
class FiscalYearRecord(models.Model):
    fiscal_year = models.CharField(max_length=20)
    receipt_count = models.PositiveIntegerField(default=0)
    application_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Fiscal Year: {self.fiscal_year} | Receipts: {self.receipt_count} | Applications: {self.application_count}"

    @staticmethod
    def get_current_fiscal_year():
        today = datetime.datetime.now()

        # Determine the current fiscal year (Nepali fiscal year: July 16 to July 15)
        if today.month > 7 or (today.month == 7 and today.day >= 16):
            fiscal_year_str = f"{today.year}/{today.year + 1 - 2000}"
        else:
            fiscal_year_str = f"{today.year - 1}/{today.year - 2000}"

        return fiscal_year_str
    
    @classmethod
    def get_or_create_current_fiscal_year(cls):
        fiscal_year = cls.get_current_fiscal_year()
        fiscal_year_record, created = cls.objects.get_or_create(fiscal_year=fiscal_year)
        return fiscal_year_record

class LedgerEntry(models.Model):
    student = models.ForeignKey('Student', on_delete=models.CASCADE)  
    date = models.DateTimeField()
    description = models.CharField(max_length=255)
    entry_by = models.CharField(max_length=255)  
    debit = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    credit = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    balance = models.DecimalField(max_digits=10, decimal_places=2)
    remarks = models.CharField(max_length=255, null=True, blank=True)  

    def __str__(self):
        return f"{self.date} - {self.description} ({self.balance})"

class StudentAccount(models.Model):
    student = models.ForeignKey('Student', on_delete=models.CASCADE)  
    year = models.IntegerField()  
    month = models.CharField(max_length=50) 
    paid_date = models.DateTimeField(null=True, blank=True) 
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)  
    payment_status = models.BooleanField(default=False)
    fee_recorded_date = models.DateTimeField(auto_now_add=True)  
    charge = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    remarks = models.TextField(null=True, blank=True) 

    def __str__(self):
        return f"{self.student.student_name} - {self.month} {self.year}: {self.payment_status}"





class News(models.Model):
    title = models.CharField(max_length=255)
    message = models.TextField()
    date = models.DateField(auto_now_add=True)
    file = models.FileField(upload_to='uploads/', blank=True, null=True)

    def __str__(self):
        return self.title


class Staff(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    photo = models.ImageField(upload_to='staff_photos/')

    def __str__(self):
        return self.name
