# Generated by Django 5.1.2 on 2024-10-25 13:48

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BSADMapping',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bs_month', models.IntegerField()),
                ('bs_year', models.IntegerField()),
                ('ad_month_start', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='FiscalYearRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fiscal_year', models.CharField(max_length=20)),
                ('receipt_count', models.PositiveIntegerField(default=0)),
                ('application_count', models.PositiveIntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='RegisterFees',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('class_name', models.CharField(choices=[('PG', 'Post Graduate'), ('Nursery', 'Nursery'), ('LKG', 'LKG'), ('UKG', 'UKG'), ('Class 1', 'Class 1'), ('Class 2', 'Class 2'), ('Class 3', 'Class 3'), ('Class 4', 'Class 4'), ('Class 5', 'Class 5'), ('Class 6', 'Class 6'), ('Class 7', 'Class 7'), ('Class 8', 'Class 8'), ('Class 9', 'Class 9'), ('Class 10', 'Class 10'), ('Class 11', 'Class 11'), ('Class 12', 'Class 12'), ('Diploma', 'Diploma')], max_length=50)),
                ('semester', models.CharField(blank=True, choices=[('1', '1'), ('2', '2'), ('3', '3'), ('4', '4'), ('5', '5'), ('6', '6')], max_length=10, null=True)),
                ('stream', models.CharField(blank=True, choices=[('Computer Engineering', 'Computer Engineering'), ('Agriculture', 'Agriculture'), ('Health Assistant', 'Health Assistant'), ('Lab Technician', 'Lab Technician'), ('Staff Nurse', 'Staff Nurse'), ('Civil Engineering', 'Civil Engineering')], max_length=100, null=True)),
                ('admission_fee', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('tuition_fee', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('library_fee', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('computer_lab_fee', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('sports_fee', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('examination_fee', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('stationery_fee', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('transportation_fee', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('miscellaneous_fee', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('student_id', models.CharField(blank=True, max_length=20, null=True)),
                ('registration_date', models.DateField(blank=True, null=True)),
                ('student_name', models.CharField(blank=True, max_length=100, null=True)),
                ('local_address', models.CharField(blank=True, max_length=100, null=True)),
                ('permanent_address', models.CharField(blank=True, max_length=100, null=True)),
                ('mobile_number', models.CharField(blank=True, max_length=15, null=True)),
                ('bus_status', models.CharField(blank=True, max_length=50, null=True)),
                ('student_type', models.CharField(blank=True, max_length=50, null=True)),
                ('local_guardian', models.CharField(blank=True, max_length=100, null=True)),
                ('received_amount', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('registration_charges', models.JSONField(blank=True, null=True)),
                ('gender', models.CharField(blank=True, max_length=10, null=True)),
                ('mother_name', models.CharField(blank=True, max_length=100, null=True)),
                ('father_name', models.CharField(blank=True, max_length=100, null=True)),
                ('dob', models.DateField(blank=True, null=True)),
                ('roll_number', models.CharField(blank=True, max_length=20, null=True)),
                ('class_name', models.CharField(blank=True, choices=[('PG', 'Post Graduate'), ('Nursery', 'Nursery'), ('LKG', 'LKG'), ('UKG', 'UKG'), ('Class 1', 'Class 1'), ('Class 2', 'Class 2'), ('Class 3', 'Class 3'), ('Class 4', 'Class 4'), ('Class 5', 'Class 5'), ('Class 6', 'Class 6'), ('Class 7', 'Class 7'), ('Class 8', 'Class 8'), ('Class 9', 'Class 9'), ('Class 10', 'Class 10'), ('Class 11', 'Class 11'), ('Class 12', 'Class 12'), ('Diploma', 'Diploma')], max_length=50, null=True)),
                ('semester', models.CharField(blank=True, choices=[('1', '1'), ('2', '2'), ('3', '3'), ('4', '4'), ('5', '5'), ('6', '6')], max_length=10, null=True)),
                ('stream', models.CharField(blank=True, choices=[('Computer Engineering', 'Computer Engineering'), ('Agriculture', 'Agriculture'), ('Health Assistant', 'Health Assistant'), ('Lab Technician', 'Lab Technician'), ('Staff Nurse', 'Staff Nurse'), ('Civil Engineering', 'Civil Engineering')], max_length=100, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=50, unique=True)),
                ('password', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='LedgerEntry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField()),
                ('description', models.CharField(max_length=255)),
                ('entry_by', models.CharField(max_length=255)),
                ('debit', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('credit', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('balance', models.DecimalField(decimal_places=2, max_digits=10)),
                ('remarks', models.CharField(blank=True, max_length=255, null=True)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app1.student')),
            ],
        ),
        migrations.CreateModel(
            name='AdministrativeCharge',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=255)),
                ('charge_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('charge', models.DecimalField(decimal_places=2, max_digits=10)),
                ('received_amount', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('paid', models.BooleanField(default=False)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='other_charges', to='app1.student')),
            ],
        ),
        migrations.CreateModel(
            name='StudentAccount',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('year', models.IntegerField()),
                ('month', models.CharField(max_length=50)),
                ('paid_date', models.DateTimeField(blank=True, null=True)),
                ('paid_amount', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('payment_status', models.BooleanField(default=False)),
                ('fee_recorded_date', models.DateTimeField(auto_now_add=True)),
                ('charge', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('remarks', models.TextField(blank=True, null=True)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app1.student')),
            ],
        ),
    ]
