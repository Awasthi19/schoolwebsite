from django.urls import path
from .views import *

urlpatterns = [
    path("register/", StudentRegistrationView.as_view(), name="register"),
    path("search/", StudentSearchView.as_view(), name="search"),
    path("pay-charge/", AdministrativeChargePaymentView.as_view(), name="pay_charge"),
    path("edit-student/", StudentEditView.as_view(), name="edit_student"),
    path("delete-student/", DeleteStudentView.as_view(), name="delete_student"),
    path("billingreport/", BillingReportView.as_view(), name="billing_report"),
    path("pay/", PayView.as_view(), name="pay"),
    path("loadpayment/", LoadPaymentView.as_view(), name="load_payment"),
    path("ledger/", StudentLedgerView.as_view(), name="ledger"),
    path("studentaccount/", StudentAccountView.as_view(), name="student-account"),
    path("bsadmapping/", BSADMappingView.as_view(), name="bsadmapping"),
    path("registerfees/", RegisterFeesView.as_view(), name="registerfees"),
    path("updatefees/", UpdateFeesView.as_view(), name="registerfees"),
    path("getfees/", GetFeesView.as_view(), name="registerfees"),
    path('loadcharges/', LoadChargesView.as_view(), name='loadcharges'),
    path('duereport/', DueReportView.as_view(), name='duereport'),

    path("news/" , NewsView.as_view(), name="news"),
    path("staff/" , StaffView.as_view(), name="staff"),
    path('initiatepayment/', EsewaPaymentFunction, name='initiatepayment'),
]