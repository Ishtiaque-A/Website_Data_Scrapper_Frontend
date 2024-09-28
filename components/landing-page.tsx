"use client";

import { useState, useEffect, FormEvent, useRef } from 'react';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { HoverEffect } from './ui/card';
import toast from 'react-hot-toast';
import { TailSpin } from 'react-loader-spinner';

interface DataItem {
  id: number;
  title: string;
  description: string;
  url: string;
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default function LandingPageContent() {
  const formRef = useRef<HTMLFormElement>(null);
  const [url, setUrl] = useState<string>('');
  const [dataList, setDataList] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get<DataItem[]>('http://localhost:8000/api/data/');
      setDataList(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url) {
      toast.error("Please enter a URL.")
      return;
    }
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/submit/', { url });
      if (res.status === 201) {
        toast.success("URL submitted and data scraped successfully.");
        setIsLoading(false);
        fetchData();  // Refresh the data list
        if (formRef.current) {
          formRef.current.reset();
        }
      } else if (res.status === 200) {
        toast.success("URL already exists.");
        setIsLoading(false);
        if (formRef.current) {
          formRef.current.reset();
        }
      }
    } catch (error) {
      console.error('Error submitting URL:', error);
      toast.error("Failed to submit URL.");
      setIsLoading(false);
      if (formRef.current) {
        formRef.current.reset();
      }
    }
  };

  const convertedItems = dataList.map(item => ({
    title: item.title,
    description: item.description,
    link: item.url,
  }));

  return (
    <div className='p-16 flex flex-col gap-[20px] align-middle items-center'>
      <div className="max-w-md w-full mx-auto rounded-2xl md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h1 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200 text-center">
          Meta Data Scrapper
        </h1>
        <p className="text-neutral-600 text-m max-w-sm mt-2 dark:text-neutral-300 text-center">
          Paste url to get the meta 👍👍👍
        </p>

        <form ref={formRef} className="my-8 mb-4" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Input id="urlinput" placeholder="example.com" type="url" className="bg-gray-100" onChange={(e) => setUrl(e.target.value)}
              required
            />
          </LabelInputContainer>
          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            {isLoading ? (
              <TailSpin color="gray" height={30} width={30} wrapperClass='justify-center' />
            ) : (
              <span>Submit &rarr;</span>
            )}
          </button>
        </form>
      </div>
      <h2>Scraped Data</h2>
      <div className="max-w-5xl mx-auto">
        <HoverEffect items={convertedItems} />
      </div>
    </div>
  );
}

