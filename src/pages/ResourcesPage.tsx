import React from 'react';
import { FileText, Download, BookOpen, Video } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'template' | 'guide' | 'video';
  url: string;
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Teljesítményértékelési sablon',
    description: 'Letölthető sablon a strukturált teljesítményértékelési beszélgetésekhez.',
    type: 'template',
    url: '#'
  },
  {
    id: '2',
    title: 'Hatékony visszajelzés adása',
    description: 'Gyakorlati útmutató a konstruktív visszajelzések megfogalmazásához.',
    type: 'guide',
    url: '#'
  },
  {
    id: '3',
    title: 'Modern toborzási trendek 2024',
    description: 'Átfogó elemzés a legújabb HR trendekről és gyakorlatokról.',
    type: 'article',
    url: '#'
  },
  {
    id: '4',
    title: 'Onboarding folyamat kialakítása',
    description: 'Videós útmutató az eredményes onboarding program létrehozásához.',
    type: 'video',
    url: '#'
  }
];

const getIcon = (type: Resource['type']) => {
  switch (type) {
    case 'template':
      return <Download className="w-6 h-6" />;
    case 'guide':
      return <BookOpen className="w-6 h-6" />;
    case 'article':
      return <FileText className="w-6 h-6" />;
    case 'video':
      return <Video className="w-6 h-6" />;
  }
};

const ResourcesPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">HR Módszertan</h1>
        <p className="mt-2 text-gray-600">
          Szakmai módszertani anyagok és útmutatók HR szakemberek számára
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                {getIcon(resource.type)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {resource.title}
                </h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <a
                  href={resource.url}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  {resource.type === 'template' ? 'Letöltés' : 'Részletek'}
                  <svg
                    className="w-4 h-4 ml-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourcesPage;
