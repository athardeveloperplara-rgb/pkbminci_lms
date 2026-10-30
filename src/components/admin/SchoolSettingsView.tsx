import React, { useState } from 'react';
import {
  Building2,
  Save,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SchoolSettingsView: React.FC = () => {
  const { schoolProfile, updateSchoolProfile, currentUser } = useApp();

  const [form, setForm] = useState({ ...schoolProfile });
  const [isSaved, setIsSaved] = useState(false);

  const canEdit =
    currentUser?.role === 'super_admin' ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'kepala_pkbm';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolProfile(form);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Profil & Pengaturan Lembaga PKBM Insan Cita
          </h2>
          <p className="text-xs text-slate-500">
            Kelola legalitas institusi, nomor izin operasional, kepala satuan pendidikan, dan tahun ajaran aktif.
          </p>
        </div>

        {isSaved && (
          <span className="flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Perubahan profil berhasil disimpan!
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identitas Lembaga */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <img
              src={form.logoUrl}
              alt="Logo PKBM"
              className="h-12 w-12 object-contain"
            />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Identitas Resmi Satuan Pendidikan</h3>
              <p className="text-xs text-slate-400">Data resmi yang tercantum pada rapor digital dan dokumen kelulusan</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Satuan PKBM</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={!canEdit}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subjudul / Deskripsi Lembaga</label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                disabled={!canEdit}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Pokok Sekolah Nasional (NPSN)</label>
              <input
                type="text"
                value={form.npsn}
                onChange={(e) => setForm({ ...form, npsn: e.target.value })}
                disabled={!canEdit}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Izin Operasional</label>
              <input
                type="text"
                value={form.operationalLicense}
                onChange={(e) => setForm({ ...form, operationalLicense: e.target.value })}
                disabled={!canEdit}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status Akreditasi</label>
              <input
                type="text"
                value={form.accreditation}
                onChange={(e) => setForm({ ...form, accreditation: e.target.value })}
                disabled={!canEdit}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Pokok Wajib Pajak (NPWP)</label>
              <input
                type="text"
                value={form.taxId}
                onChange={(e) => setForm({ ...form, taxId: e.target.value })}
                disabled={!canEdit}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Pimpinan & Periode Aktif */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Pimpinan Lembaga & Periode Akademik Aktif
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kepala PKBM</label>
              <input
                type="text"
                value={form.headmasterName}
                onChange={(e) => setForm({ ...form, headmasterName: e.target.value })}
                disabled={!canEdit}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NIP Kepala Satuan</label>
              <input
                type="text"
                value={form.headmasterNip}
                onChange={(e) => setForm({ ...form, headmasterNip: e.target.value })}
                disabled={!canEdit}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun Ajaran Aktif</label>
              <input
                type="text"
                value={form.activeAcademicYear}
                onChange={(e) => setForm({ ...form, activeAcademicYear: e.target.value })}
                disabled={!canEdit}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Semester Aktif</label>
              <select
                value={form.activeSemester}
                onChange={(e) => setForm({ ...form, activeSemester: e.target.value as any })}
                disabled={!canEdit}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lokasi & Kontak */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Alamat & Kontak Layanan
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Kantor PKBM</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                disabled={!canEdit}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kecamatan</label>
              <input
                type="text"
                value={form.subdistrict}
                onChange={(e) => setForm({ ...form, subdistrict: e.target.value })}
                disabled={!canEdit}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kota / Kabupaten & Provinsi</label>
              <input
                type="text"
                value={`${form.districtCity}, ${form.province}`}
                onChange={(e) => {
                  const parts = e.target.value.split(',');
                  setForm({
                    ...form,
                    districtCity: parts[0]?.trim() || form.districtCity,
                    province: parts[1]?.trim() || form.province,
                  });
                }}
                disabled={!canEdit}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Telepon / WhatsApp</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                disabled={!canEdit}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Resmi</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={!canEdit}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {canEdit && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-md transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Simpan Pengaturan Lembaga</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
