"use client";

import React from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';

interface DataItem {
  id: number;
  title: string;
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

export function UrlForm() {
  const [url, setUrl] = useState<string>('');
  const [dataList, setDataList] = useState<DataItem[]>([]);
  const [message, setMessage] = useState<string>('');

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
      setMessage('Please enter a URL.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8000/api/submit/', { url });
      if (res.status === 201) {
        setMessage('URL submitted and data scraped successfully.');
        setUrl('');
        fetchData();  // Refresh the data list
      } else if (res.status === 200) {
        setMessage('URL already exists.');
      }
    } catch (error) {
      console.error('Error submitting URL:', error);
      setMessage('Failed to submit URL.');
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center">
        Url Scraper
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300 text-center">
        Paste url to get the title 👍👍👍
      </p>

      <form className="my-8 mb-4" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Input id="urlinput" placeholder="example.com" type="url" className="bg-gray-100" onChange={(e) => setUrl(e.target.value)}
            required
          />
        </LabelInputContainer>
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Submit &rarr;
        </button>
      </form>
    </div>
  );
}


