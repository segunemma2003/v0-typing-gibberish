import React from 'react';

export function LandingPage() {
  return (
    <div>
      {/* Hero Section - Inspired by schoolwave.ng's clean, prominent hero */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-8 overflow-hidden">
        {/* Background elements for visual interest */}
        <div className="absolute inset-0 z-0 opacity-20">
          <svg className="w-full h-full" fill="none" viewBox="0 0 100 100">
            <defs>
              <pattern id="pattern-circles" x="0" y="0" width=".7" height=".7" patternUnits="userSpaceOnUse">
                <circle fill="#fff" cx="5" cy="5" r="3"></circle>
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between text-center lg:text-left py-16">
          <div className="lg:w-1/2 space-y-6 animate-fade-in-left">
            <h1 className="text-6xl font-extrabold leading-tight">
              Compasse Africa: Modern School Management Made Easy
            </h1>
            <p className="text-xl font-light leading-relaxed max-w-lg lg:max-w-none">
              Streamline operations, enhance learning, and foster collaboration with Africa's leading school management system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
              <a href="/request-a-demo" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-lg">
                Book a Free Demo
              </a>
              <a href="/features" className="inline-block bg-white hover:bg-gray-100 text-blue-800 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-lg">
                Learn More
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 mt-12 lg:mt-0 animate-fade-in-right flex justify-center">
            {/* Placeholder for a hero image or animation */}
            <img src="/images/hero-dashboard.png" alt="Compasse Africa Dashboard Mockup" className="rounded-lg shadow-2xl w-full max-w-md lg:max-w-lg object-cover" />
          </div>
        </div>
      </section>

      {/* What We Offer / Key Features Section - Inspired by schoolwave.ng's feature blocks */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-blue-800 mb-6">What Compasse Africa Offers</h2>
          <p className="text-xl text-gray-700 mb-16 max-w-3xl mx-auto">
            Comprehensive tools designed to bring efficiency and innovation to every aspect of school management.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Feature Item 1: Student & Staff Management */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center border-b-4 border-blue-500">
              <div className="text-blue-600 text-6xl mb-6"><i className="fas fa-users"></i></div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Student & Staff Management</h3>
              <p className="text-lg text-gray-700">Efficiently manage student records, staff profiles, admissions, and academic progress with ease.</p>
            </div>

            {/* Feature Item 2: E-Learning & CBT */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center border-b-4 border-green-500">
              <div className="text-green-600 text-6xl mb-6"><i className="fas fa-laptop-code"></i></div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">E-Learning & CBT</h3>
              <p className="text-lg text-gray-700">Conduct online tests, quizzes, and deliver interactive lessons for an engaging learning experience.</p>
            </div>

            {/* Feature Item 3: Financial Management */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center border-b-4 border-yellow-500">
              <div className="text-yellow-600 text-6xl mb-6"><i className="fas fa-wallet"></i></div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Financial Management</h3>
              <p className="text-lg text-gray-700">Seamlessly handle fee payments, accounting, and payroll with robust financial tools.</p>
            </div>

            {/* Feature Item 4: Communication Hub */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center border-b-4 border-red-500">
              <div className="text-red-600 text-6xl mb-6"><i className="fas fa-comments"></i></div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Communication Hub</h3>
              <p className="text-lg text-gray-700">Improve interaction between teachers, students, and parents via messages and notifications.</p>
            </div>

            {/* Feature Item 5: Academic Tracking */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center border-b-4 border-purple-500">
              <div className="text-purple-600 text-6xl mb-6"><i className="fas fa-chart-line"></i></div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Academic Tracking</h3>
              <p className="text-lg text-gray-700">Monitor student performance, manage grades, and generate comprehensive academic reports.</p>
            </div>

            {/* Feature Item 6: Library & Resources */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center border-b-4 border-pink-500">
              <div className="text-pink-600 text-6xl mb-6"><i className="fas fa-book-reader"></i></div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Library & Resources</h3>
              <p className="text-lg text-gray-700">Centralized access to e-library, class notes, and educational materials for students.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics / Impact Section - Placeholder (similar to schoolwave.ng's numbers) */}
      <section className="py-20 bg-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-16">Our Impact in Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="p-6">
              <div className="text-6xl font-extrabold text-green-400 mb-2">500+</div>
              <p className="text-xl">Schools Onboarded</p>
            </div>
            <div className="p-6">
              <div className="text-6xl font-extrabold text-green-400 mb-2">100,000+</div>
              <p className="text-xl">Active Users</p>
            </div>
            <div className="p-6">
              <div className="text-6xl font-extrabold text-green-400 mb-2">10+</div>
              <p className="text-xl">Countries Served</p>
            </div>
            <div className="p-6">
              <div className="text-6xl font-extrabold text-green-400 mb-2">24/7</div>
              <p className="text-xl">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section - Cleaned up */}
      <section className="py-20 bg-gray-50 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-blue-800 mb-12">What Our Clients Say</h2>
          <div className="bg-white p-12 rounded-xl shadow-2xl relative border-t-8 border-blue-500">
            <p className="text-2xl italic text-gray-700 leading-relaxed mb-8">
              &ldquo;Compasse Africa transformed our school management. The automated reports are incredibly accurate, freeing up our staff to focus more on students. Transcripts, report cards, and attendance are just a few clicks away!&rdquo;
            </p>
            <div className="flex flex-col items-center space-y-4">
              <img src="/images/joshua.jpg" alt="Mr. Joshua Enebi" className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white" />
              <div className="font-semibold text-xl text-gray-900">Mr. Joshua Enebi</div>
              <div className="text-blue-600">IT Staff, Highstone College Lagos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section - More prominent */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-teal-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-bold mb-6">Ready to Transform Your School?</h2>
          <p className="text-xl mb-10 leading-relaxed">
            Join hundreds of schools across Africa benefiting from Compasse Africa. Book a free demo today!
          </p>
          <a href="/request-a-demo" className="inline-block bg-white hover:bg-gray-100 text-green-700 font-bold py-4 px-12 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-2xl">
            Book Your Demo Now
          </a>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-lg">&copy; 2024 Compasse Africa. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Contact Us</a>
            </div>
          </div>
          {/* Optional: Add social media icons here later */}
        </div>
      </footer>
    </div>
  );
}
