from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

from django import forms
from .models import Product

class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['name', 'description']
def clean(self):
    cleaned_data = self.cleaned_data
    name = cleaned_data.get('name')
    description = cleaned_data.get('description')

    forbidden_words = ['казино', 'криптовалюта', 'крипта', 'биржа', 'дешево', 'бесплатно', 'обман', 'полиция', 'радар']

    for word in forbidden_words:
        if word in name.lower() or word in description.lower():
            raise forms.ValidationError("Нельзя добавлять запрещенные слова в название или описание продукта.")

    return cleaned_data
class Version(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    version_number = models.IntegerField()
    version_name = models.CharField(max_length=100)
    is_current = models.BooleanField(default=False)
class VersionForm(forms.ModelForm):
    class Meta:
        model = Version
        fields = ['product', 'version_number', 'version_name', 'is_current']
def product_list(request):
    products = Product.objects.all()
    active_versions = Version.objects.filter(is_current=True)

    return render(request, 'product_list.html', {'products': products, 'active_versions': active_versions})
