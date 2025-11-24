import { useState } from 'react';
import newsData from '../data/news.json';
import agendaData from '../data/agenda.json';

const BeritaAgenda = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredNews = newsData.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          Berita dan Agenda
        </h2>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 pr-12 rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* News Section - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {filteredNews.map((news) => (
              <div key={news.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-1/3">
                    <img 
                      src={news.image} 
                      alt={news.title}
                      className="w-full h-48 sm:h-full object-cover"
                    />
                  </div>
                  <div className="sm:w-2/3 p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {news.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-semibold text-sm">
                        {news.date}
                      </span>
                      <button className="text-blue-600 hover:text-blue-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Agenda Section - 1/3 width */}
          <div className="space-y-4">
            {agendaData.map((agenda) => (
              <div key={agenda.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition duration-300">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-800 mb-1">
                      {agenda.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {agenda.date}
                    </p>
                  </div>
                  <button className="flex-shrink-0 text-blue-600 hover:text-blue-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeritaAgenda;