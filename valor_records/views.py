from django.shortcuts import render, get_object_or_404
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import CreateView, UpdateView, DeleteView
from .models import ValorRecord
from .forms import ValorRecordForm


def valor_record_detail(request, slug):
    valor_record = get_object_or_404(ValorRecord, slug=slug, status='approved')
    return render(
        request,
        'valor_records/valor_record_detail.html',
        {'valor_record': valor_record}
    )


def valor_record_modal(request, slug):
    valor_record = get_object_or_404(ValorRecord, slug=slug, status='approved')
    return render(
        request,
        'mapper/modals/view_card_modal_content.html',
        {'valor_record': valor_record}
    )


class ValorRecordCreateView(LoginRequiredMixin, CreateView):
    model = ValorRecord
    form_class = ValorRecordForm
    template_name = 'valor_records/valor_record_form.html'
    success_url = reverse_lazy('map_view')

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        return super().form_valid(form)


class ValorRecordUpdateView(LoginRequiredMixin, UpdateView):
    model = ValorRecord
    form_class = ValorRecordForm
    template_name = 'valor_records/valor_record_form.html'
    success_url = reverse_lazy('map_view')

    def form_valid(self, form):
        form.instance.last_edited_by = self.request.user
        return super().form_valid(form)


class ValorRecordDeleteView(LoginRequiredMixin, DeleteView):
    model = ValorRecord
    template_name = 'valor_records/valor_record_confirm_delete.html'
    success_url = reverse_lazy('map_view')
