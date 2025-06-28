import { useState } from 'react';
import { Search, Filter, MessageSquare, Star, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { MOCK_FEEDBACK } from '../constants/mockData';

export function Feedback() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [feedback] = useState(MOCK_FEEDBACK);

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'reviewed': return 'info';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'reviewed': return 'Đã xem';
      case 'resolved': return 'Đã giải quyết';
      default: return status;
    }
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'feedback': return 'info';
      case 'survey': return 'success';
      case 'complaint': return 'error';
      default: return 'default';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'feedback': return 'Phản hồi';
      case 'survey': return 'Khảo sát';
      case 'complaint': return 'Khiếu nại';
      default: return type;
    }
  };

  const renderStars = (rating: number | undefined) => {
    if (!rating) return null;
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">({rating}/5)</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Phản hồi & Khảo sát</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Xem và quản lý phản hồi từ người dùng
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" icon={Filter}>Bộ lọc</Button>
          <Button>Tạo khảo sát</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{feedback.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Tổng phản hồi</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-yellow-600">{feedback.filter(f => f.status === 'pending').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Chờ xử lý</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600">{feedback.filter(f => f.status === 'resolved').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Đã giải quyết</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600">
            {(feedback.filter(f => f.rating).reduce((acc, f) => acc + (f.rating || 0), 0) / feedback.filter(f => f.rating).length || 0).toFixed(1)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Đánh giá trung bình</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề, nội dung hoặc người gửi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Tất cả loại</option>
            <option value="feedback">Phản hồi</option>
            <option value="survey">Khảo sát</option>
            <option value="complaint">Khiếu nại</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="reviewed">Đã xem</option>
            <option value="resolved">Đã giải quyết</option>
          </select>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <img
                  src={item.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.user.name)}&background=3b82f6&color=fff`}
                  alt={item.user.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <Badge variant={getTypeVariant(item.type)}>
                      {getTypeText(item.type)}
                    </Badge>
                    <Badge variant={getStatusVariant(item.status)}>
                      {getStatusText(item.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                    <span>{item.user.name}</span>
                    <span>•</span>
                    <span>{item.user.university}</span>
                    <span>•</span>
                    <span>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                    <span>•</span>
                    <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-2 py-1 rounded-full text-xs">
                      {item.category}
                    </span>
                  </div>

                  {item.rating && (
                    <div className="mb-3">
                      {renderStars(item.rating)}
                    </div>
                  )}

                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {item.content}
                  </p>

                  {item.response && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-400">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-400">
                          Phản hồi từ Admin
                        </span>
                        <span className="text-xs text-blue-600 dark:text-blue-400">
                          {item.respondedAt ? new Date(item.respondedAt).toLocaleDateString('vi-VN') : ''}
                        </span>
                      </div>
                      <p className="text-blue-800 dark:text-blue-300">{item.response}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                {item.status === 'pending' && (
                  <>
                    <Button size="sm" variant="primary">
                      Phản hồi
                    </Button>
                    <Button size="sm" variant="outline">
                      Đánh dấu đã xem
                    </Button>
                  </>
                )}
                {item.status === 'reviewed' && (
                  <Button size="sm" variant="primary">
                    Giải quyết
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}