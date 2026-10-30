import React, { useState } from 'react';
import {
  MessagesSquare,
  Plus,
  Send,
  MessageCircle,
  Pin,
  User,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DiscussionsView: React.FC = () => {
  const { discussions, classes, subjects, addDiscussionTopic, addDiscussionReply, currentUser } = useApp();

  const [selectedTopicId, setSelectedTopicId] = useState<string>(discussions[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [isNewTopicModalOpen, setIsNewTopicModalOpen] = useState(false);

  // New topic state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newClassId, setNewClassId] = useState(classes[0]?.id || '');
  const [newSubjectId, setNewSubjectId] = useState(subjects[0]?.id || '');

  const selectedTopic = discussions.find((d) => d.id === selectedTopicId) || discussions[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTopic) return;

    addDiscussionReply(selectedTopic.id, replyText);
    setReplyText('');
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const cls = classes.find((c) => c.id === newClassId);
    const sub = subjects.find((s) => s.id === newSubjectId);

    addDiscussionTopic({
      classId: cls?.id || 'cls_c12',
      className: cls?.name || 'Paket C - Kelas 12',
      subjectId: sub?.id || 'sub_1',
      subjectName: sub?.name || 'Kewirausahaan Digital',
      title: newTitle,
      content: newContent,
    });

    setIsNewTopicModalOpen(false);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Forum Diskusi & Kolaborasi Belajar
          </h2>
          <p className="text-xs text-slate-500">
            Tanya jawab materi, konsultasi tugas dengan tutor, dan ruang diskusi antarteman sekelas.
          </p>
        </div>

        <button
          onClick={() => setIsNewTopicModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Buat Topik Diskusi Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Topics List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="font-bold text-xs uppercase tracking-wider text-slate-500 px-1">
            Topik Diskusi Terkini ({discussions.length})
          </div>

          {discussions.map((topic) => {
            const isSelected = selectedTopic?.id === topic.id;
            return (
              <div
                key={topic.id}
                onClick={() => setSelectedTopicId(topic.id)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    {topic.subjectName}
                  </span>
                  {topic.isPinned && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700">
                      <Pin className="h-3 w-3" /> Disematkan
                    </span>
                  )}
                </div>

                <h4 className="mt-2 text-xs font-bold text-slate-900 line-clamp-2">
                  {topic.title}
                </h4>
                <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                  {topic.content}
                </p>

                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-2">
                  <span>Oleh: {topic.authorName}</span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <MessageCircle className="h-3 w-3" />
                    {topic.replies.length} Tanggapan
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Topic Thread */}
        <div className="lg:col-span-8 space-y-4">
          {selectedTopic ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between min-h-[500px]">
              <div>
                {/* Topic Header */}
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      {selectedTopic.subjectName} • {selectedTopic.className}
                    </span>
                    <span className="text-xs text-slate-400">
                      {selectedTopic.createdAt.split('T')[0]}
                    </span>
                  </div>

                  <h3 className="mt-2 text-base font-bold text-slate-900">
                    {selectedTopic.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      {selectedTopic.authorName.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800">
                        {selectedTopic.authorName}
                      </span>
                      <span className="text-[10px] text-slate-400 block capitalize">
                        {selectedTopic.authorRole}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    {selectedTopic.content}
                  </p>
                </div>

                {/* Replies Thread */}
                <div className="mt-5 space-y-3 max-h-72 overflow-y-auto pr-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Balasan & Diskusi ({selectedTopic.replies.length}):
                  </span>

                  {selectedTopic.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{reply.authorName}</span>
                          <span
                            className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                              reply.authorRole === 'tutor'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {reply.authorRole === 'tutor' ? 'Tutor Pendidik' : 'Warga Belajar'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {reply.createdAt.split('T')[0]}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{reply.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Input Box */}
              <form onSubmit={handleSendReply} className="mt-5 pt-3 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Ketik tanggapan atau penjelasan Anda..."
                  className="flex-1 px-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Kirim</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
              Pilih topik diskusi di samping.
            </div>
          )}
        </div>
      </div>

      {/* New Topic Modal */}
      {isNewTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Buat Topik Diskusi Baru</h3>
              <button
                onClick={() => setIsNewTopicModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Topik *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Pertanyaan seputar perhitungan margin pada Tugas Mandiri 01"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas</label>
                  <select
                    value={newClassId}
                    onChange={(e) => setNewClassId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                  <select
                    value={newSubjectId}
                    onChange={(e) => setNewSubjectId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Uraian Pertanyaan</label>
                <textarea
                  rows={3}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Jelaskan pertanyaan atau topik bahasan secara rinci..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewTopicModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                >
                  Publikasikan Topik
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
