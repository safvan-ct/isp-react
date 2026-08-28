import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import HomePage from '../components/HomePage';
import QuranPage from '../features/quran/pages/QuranPage';
import SurahPage from '../features/quran/pages/SurahPage';
import HadithBooksPage from '../features/hadith/pages/HadithBooksPage';
import HadithChaptersPage from '../features/hadith/pages/HadithChaptersPage';
import HadithDetailPage from '../features/hadith/pages/HadithDetailPage';
import CoursesPage from '../features/courses/pages/CoursesPage';
import TrackPage from '../features/courses/pages/TrackPage';
import LearningPage from '../features/courses/pages/LearningPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: 'quran',
        element: <QuranPage />,
      },
      {
        path: 'quran/:surahSlug',
        element: <SurahPage />,
      },
      {
        path: 'hadith',
        element: <HadithBooksPage />,
      },
      {
        path: 'hadith/:bookId',
        element: <HadithChaptersPage />,
      },
      {
        path: 'hadith/:bookSlug/:chapterSlug',
        element: <HadithDetailPage />,
      },
      {
        path: 'hadith/:bookSlug/hadiths/:hadithNumber',
        element: <HadithDetailPage />,
      },
      {
        path: 'courses',
        element: <CoursesPage />,
      },
      {
        path: 'courses/:trackId',
        element: <TrackPage />,
      },
      {
        path: 'courses/view/:courseId',
        element: <LearningPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      }
    ]
  }
]);
