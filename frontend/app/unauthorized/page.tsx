"use client"; // If using App Router and client-side interactions

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // For App Router
import { useTranslation } from 'react-i18next'; // Assuming you have i18n setup

export default function UnauthorizedPage() {
  const { t } = useTranslation();
  const router = useRouter();

  // Optional: Redirect after a few seconds if you want to automatically take them somewhere
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     router.push('/'); // Redirect to homepage or login page
  //   }, 5000); // 5 seconds
  //   return () => clearTimeout(timer);
  // }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-4">
          403 - {t('Unauthorized Access')}
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {t('You do not have permission to view this page.')}
        </p>
        <div className="space-y-4">
          {/* <button
            onClick={() => router.back()}
            className="w-full px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            {t('Go Back')}
          </button> */}
          <Link href="/dashboard" legacyBehavior>
            <a className="w-full inline-flex justify-center items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
              {t('Go to Homepage')}
            </a>
          </Link>
          {/* Optional: Add a link to the login page if applicable */}
          {/* <Link href="/login" legacyBehavior>
            <a className="w-full inline-flex justify-center items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
              {t('Login')}
            </a>
          </Link> */}
        </div>
      </div>
    </div>
  );
}