import React, { useState } from 'react';
import { Table, Collapse } from 'antd';
import salaryData from '../salaries.json'
import { ColumnsType } from 'antd/es/table';

interface MainTableProps {
  data: { year: number; totalJobs: number; averageSalary: number }[];
}

interface JobData {
  jobTitle: string;
  count: number;
}

// Assuming the structure of objects in salaryData is similar to SalaryData interface
interface SalaryItem {
  work_year: number;
  job_title: string;
}

const { Panel } = Collapse;

const MainNewTable: React.FC<MainTableProps> = ({ data }) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [jobData, setJobData] = useState<JobData[]>([]);

  const handleRowClick = (record: { year: number }) => {
    // Filter the data for the selected year
    const selectedYearData = data.find((item) => item.year === record.year);
    if (selectedYearData) {
      // Assuming salaryData is the original data with job titles
      const jobsForYear = salaryData.filter((item: SalaryItem) => item.work_year === record.year);

      // Aggregate job titles and count occurrences
      const jobCounts: { [key: string]: number } = {};
      jobsForYear.forEach((job) => {
        if (job.job_title in jobCounts) {
          jobCounts[job.job_title] += 1;
        } else {
          jobCounts[job.job_title] = 1;
        }
      });

      // Convert job counts to array of objects
      const jobData = Object.keys(jobCounts).map((jobTitle) => ({
        jobTitle,
        count: jobCounts[jobTitle],
      }));

      // Set the job data for the selected year
      setJobData(jobData);
      setSelectedYear(record.year);
    }
  };

  const columns: ColumnsType<any> = [
    { title: 'Year', dataIndex: 'year', key: 'year',align: 'center', width: '33.33%', sorter: (a: any, b: any) => a.year - b.year, },
    { title: 'Total Jobs', dataIndex: 'totalJobs', key: 'totalJobs',align: 'center' , width: '33.33%', sorter: (a: any, b: any) => a.totalJobs - b.totalJobs, },
    { title: 'Average Salary', dataIndex: 'averageSalary', key: 'averageSalary',align: 'center' , width: '33.33%',  sorter: (a: any, b: any) => a.averageSalary - b.averageSalary,},
  ];


  return (
    <div>
      <h1>Main Table</h1>
      <Table
        dataSource={data}
        columns={columns}
        expandable={{
          expandedRowRender: (record) => (
            <Collapse bordered={false}>
              <Panel header={`Job Titles in ${record.year}`} key={record.year}>
                <Table
                  dataSource={jobData}
                  columns={[
                    { title: 'Job Title', dataIndex: 'jobTitle', key: 'jobTitle',sorter: (a: any, b: any) => a.jobTitle - b.jobTitle },
                    { title: 'Number of Jobs', dataIndex: 'count', key: 'count',sorter: (a: any, b: any) => a.count - b.count },
                  ]}
                  pagination={false}
                />
              </Panel>
            </Collapse>
          ),
          rowExpandable: (record) => record.year === selectedYear,
        }}
        onRow={(record) => ({ onClick: () => handleRowClick(record) })}
      />
    </div>
  );
};

export default MainNewTable;
