'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockAuthService } from '@/lib/mockAuth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { error } = await mockAuthService.resetPasswordForEmail(email);

      if (error) {
        setError(error.message);
      } else {
        setSuccess('⚠️ Demo Mode: Kiểm tra console developer để xem hướng dẫn khôi phục (Ctrl+Shift+J)');
        setEmail('');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Khôi Phục Mật Khẩu
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Nhập email để nhận hướng dẫn đặt lại mật khẩu
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            {loading ? 'Đang gửi...' : 'Gửi Email Khôi Phục'}
          </button>
        </form>

        <div className="mt-6 space-y-2 text-center">
          <Link
            href="/login"
            className="block text-sm text-orange-500 hover:text-orange-600 font-medium"
          >
            ← Quay lại Đăng Nhập
          </Link>
        </div>

        <div className="mt-4 p-3 bg-orange-50 rounded-lg text-xs text-orange-700">
          💡 Demo: Trong mode demo, bạn có thể đặt lại mật khẩu bằng cách:
          1. Nhập email của bạn ở đây
          2. Mở Developer Tools (F12)
          3. Truy cập tab Reset Password và cập nhật mật khẩu mới
        </div>
      </div>
    </div>
  );
}
