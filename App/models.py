from django.db import models

# Create your models here.
class Person(models.Model):
    P_name = models.CharField(max_length=50)
    P_ig = models.CharField(max_length=50)
    P_say = models.CharField(max_length=200)
    P_result = models.CharField(max_length=50)
    P_time = models.CharField(max_length=50)

    def __str__(self):
        return self.P_name,self.P_ig,self.P_say,self.P_result,self.P_time