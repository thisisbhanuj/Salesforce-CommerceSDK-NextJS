'use client';

import React from 'react';

import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';

const ContactUs = () => {
  return (
    <>
      {/* <Header heading='Contact Us'  navModel={[]} subHeading=''/> */}
      <div className="contact-us py-10 md:py-20">
        <div className="container">
          <div className="flex justify-between gap-y-10 max-lg:flex-col">
            <div className="left lg:w-2/3 lg:pr-4">
              <div className="heading3">Drop Us A Line</div>
              <div className="body1 mt-3 text-secondary2">
                Use the form below to get in touch with the sales team
              </div>
              <form className="mt-4 md:mt-6">
                <div className="grid grid-cols-1 gap-4 gap-y-5 sm:grid-cols-2">
                  <div className="name">
                    <input
                      className="w-full rounded-lg border-line px-4 py-3"
                      id="username"
                      type="text"
                      placeholder="Your Name *"
                      required
                    />
                  </div>
                  <div className="email">
                    <input
                      className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                      id="email"
                      type="email"
                      placeholder="Your Email *"
                      required
                    />
                  </div>
                  <div className="message sm:col-span-2">
                    <textarea
                      className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                      id="message"
                      rows={3}
                      placeholder="Your Message *"
                      required
                    />
                  </div>
                </div>
                <div className="block-button mt-4 md:mt-6">
                  <button className="button-main">Send message</button>
                </div>
              </form>
            </div>
            <div className="right lg:w-1/4 lg:pl-4">
              <div className="item">
                <div className="heading4">Our Store</div>
                <p className="mt-3">
                  2163 Phillips Gap Rd, West Jefferson, North Carolina, United
                  States
                </p>
                <p className="mt-3">
                  Phone: <span className="whitespace-nowrap">+1 666 8888</span>
                </p>
                <p className="mt-1">
                  Email:{' '}
                  <span className="whitespace-nowrap">
                    tobhanuj.kashyap@gmail.com
                  </span>
                </p>
              </div>
              <div className="item mt-10">
                <div className="heading4">Open Hours</div>
                <p className="mt-3">
                  Mon - Fri:{' '}
                  <span className="whitespace-nowrap">7:30am - 8:00pm PST</span>
                </p>
                <p className="mt-3">
                  Saturday:{' '}
                  <span className="whitespace-nowrap">8:00am - 6:00pm PST</span>
                </p>
                <p className="mt-3">
                  Sunday:{' '}
                  <span className="whitespace-nowrap">9:00am - 5:00pm PST</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
