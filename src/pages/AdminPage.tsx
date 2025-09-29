import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import TopicsSection from '../components/admin/TopicsSection';
import ContentsSection from '../components/admin/ContentsSection';
import TrainersSection from '../components/admin/TrainersSection';
import DatesSection from '../components/admin/DatesSection';
import SessionsSection from '../components/admin/SessionsSection'; // Ensure this is imported

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('topics');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Tréningek kezelése</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="topics">Témák</TabsTrigger>
          <TabsTrigger value="contents">Tartalmak</TabsTrigger>
          <TabsTrigger value="trainers">Trénerek</TabsTrigger>
          <TabsTrigger value="dates">Időpontok</TabsTrigger>
          <TabsTrigger value="sessions">Képzések</TabsTrigger>
        </TabsList>

        <TabsContent value="topics">
          <TopicsSection />
        </TabsContent>

        <TabsContent value="contents">
          <ContentsSection />
        </TabsContent>

        <TabsContent value="trainers">
          <TrainersSection />
        </TabsContent>

        <TabsContent value="dates">
          <DatesSection />
        </TabsContent>

        <TabsContent value="sessions">
          <SessionsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
