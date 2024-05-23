import React, { useEffect, useState } from 'react';
import salaryData from '../salaries.json'
import MainNewTable from '../newtable/index'
import { Line } from '@ant-design/charts';


interface SalaryData {
    "work_year": number;
    "experience_level": string;
    "employment_type": string;
    "job_title": string;
    "salary": number;
    "salary_currency": string;
    "salary_in_usd": number;
    "employee_residence": string;
    "remote_ratio": number;
    "company_location": string;
    "company_size": string;
  }

const typedSalaryData: SalaryData[] = salaryData as SalaryData[];

interface ProcessedData {
    [year: number]: {
      totalJobs: number;
      totalSalary: number;
    };
  }
  
  const processData = (data: SalaryData[]): ProcessedData => {
    return data.reduce((acc: ProcessedData, current) => {
      const year = current.work_year;
      if (!acc[year]) {
        acc[year] = { totalJobs: 0, totalSalary: 0 };
      }
      acc[year].totalJobs += 1;
      acc[year].totalSalary += current.salary_in_usd;
      return acc;
    }, {});
  };
const MainTable: React.FC = () => {
    const [data, setData] = useState<SalaryData[]>([]);
  
    useEffect(() => {
      setData(typedSalaryData); 
      
 }, []);
 

 const processedData = processData(data);

 const tableData = Object.keys(processedData).map((yearStr) => {
    const year = parseInt(yearStr, 10);
    return {
      year,
      totalJobs: processedData[year].totalJobs,
      averageSalary:  parseFloat((processedData[year].totalSalary / processedData[year].totalJobs).toFixed(3)),
      
    };
  });

  const config = {
    data: tableData,
    xField: 'year',
    yField: 'averageSalary',
    point: {
      size: 5,
      shape: 'diamond',
    },
    xAxis: {
      label: {
        formatter: (v: number) => `${v}`,
      },
    },
    yAxis: {
      label: {
        formatter: (v:number) => `$${v}`,
      },
    },
    tooltip: {
      showMarkers: false,
      title: 'Year',
      formatter: (datum: { year: number; averageSalary: number }) => {
        return {
          name: 'Average Salary',
          value: `$${datum.averageSalary.toFixed(2)}`,
        };
      },
    },
    title: {
      text: 'Average Salary Change (2020 - 2024)',
      style: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
    },
    smooth: true,
  };


  return (<>

    
    <MainNewTable data={tableData} />;
    <Line {...config} />
    </>
  );
};

export default MainTable