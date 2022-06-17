import type { NextPage } from "next";
import Head from 'next/head';
import React, { useState } from 'react';

import { Frame } from '../components/Frame';
import { NavBar } from '../components/NavBar';
import { Sidebar } from '../components/Sidebar';
import { APIResult, ExtendedAPIResult, Stats, Story, StoryKind, User } from '../store/types';

interface HomeState {
  currentStory?: Story;
  currentStats?: Stats;
  currentUser?: User;
  lastError?: string;
  loading: boolean;
}

class Home extends React.Component<NextPage, HomeState> {
  constructor(props: object) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  componentDidMount = () => {
    this.loadStory("top");
  };

  render() {
    const { currentStory, currentStats, currentUser, loading, lastError } =
      this.state;
    return (
      <div className="bg-white">
        <Head>
          <title>[RANDHN]</title>
          <meta name="description" content="Hacker News Roulette" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <NavBar loadStory={this.loadStory} loading={loading} />
        <main className={`flex`}>
          <div
            className={`fixed w-full h-full z-40 flex items-center justify-around pointer-events-none transition-all ease-out duration-500 bg-owhite bg-opacity-20  ${
              loading ? "opacity-75" : "opacity-0"
            }`}
          >
            <svg
              className={`${loading ? "animate-spin" : ""} text-orange-800`}
              width="128"
              height="128"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4.75V6.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M17.1266 6.87347L16.0659 7.93413"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M19.25 12L17.75 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M17.1266 17.1265L16.0659 16.0659"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M12 17.75V19.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M7.9342 16.0659L6.87354 17.1265"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M6.25 12L4.75 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M7.9342 7.93413L6.87354 6.87347"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </div>
          <Frame
            className="flex-1"
            url={currentStory?.url}
            story={currentStory}
          />
          <Sidebar
            className="flex-0 bg-orange-50"
            story={currentStory}
            stats={currentStats}
            user={currentUser}
            loading={loading}
          />
        </main>
      </div>
    );
  }

  loadStory = async (storyType: StoryKind) => {
    if (this.state.loading) {
      return;
    }

    this.setState({
      lastError: undefined,
      loading: true,
    });

    try {
      const res = await fetch(`/api/next?kind=${storyType}`, {
        method: "GET",
        headers: {
          "Accept-Encoding": "application/json",
        },
      });

      const apires: ExtendedAPIResult = await res.json();
      this.setState({
        currentStory: apires.story,
        currentStats: apires.stats,
        currentUser: apires.user,
        loading: false,
      });
    } catch (e) {
      this.setState({
        lastError: (e as Error).toString(),
        loading: false,
        currentStory: undefined,
        currentStats: undefined,
        currentUser: undefined,
      });
    }
  };
}

export default Home;

/*
          style={{
            backgroundRepeat: "no-repeat",
            backgroundSize: "256px",
            backgroundPosition: "center",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512'%3E%3C!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --%3E%3Cpath fill='rgba(223, 84, 11, 0.1)' d='M224 296c-13.25 0-23.1 10.75-23.1 23.1s10.75 23.1 23.1 23.1s23.1-10.75 23.1-23.1S237.3 296 224 296zM128 200c-13.25 0-23.1 10.75-23.1 23.1s10.75 23.1 23.1 23.1S152 237.3 152 224S141.3 200 128 200zM224 200c-13.25 0-23.1 10.75-23.1 23.1s10.75 23.1 23.1 23.1s23.1-10.75 23.1-23.1S237.3 200 224 200zM479.1 376c13.25 0 23.1-10.75 23.1-23.1s-10.75-23.1-23.1-23.1s-23.1 10.75-23.1 23.1S466.7 376 479.1 376zM224 104c-13.25 0-23.1 10.75-23.1 23.1s10.75 23.1 23.1 23.1s23.1-10.75 23.1-23.1S237.3 104 224 104zM575.1 192l-102.7-.0001c3.59 10.21 5.848 20.92 5.848 31.1h96.87c17.62 0 31.1 14.37 31.1 31.1v191.1c0 17.62-14.37 31.1-31.1 31.1h-191.1c-17.62 0-31.1-14.37-31.1-31.1v-56.74L320 423.2v24.84C320 483.4 348.6 512 383.1 512h191.1c35.37 0 63.1-28.62 63.1-63.1v-191.1C639.1 220.6 611.4 192 575.1 192zM320 200c-13.25 0-23.1 10.75-23.1 23.1S306.8 248 320 248s23.1-10.75 23.1-23.1S333.2 200 320 200zM447.1 224c0-17.15-6.691-33.43-18.84-45.83L270.1 19.08C257.4 6.695 241.1 0 223.1 0S190.6 6.695 178.2 18.85L19.07 177.9C6.695 190.6-.0011 206.8-.0011 223.1c0 17.15 6.696 33.48 18.85 45.87l159.1 159.1c12.63 12.38 28.9 19.07 46.06 19.07s33.43-6.693 45.83-18.85l159.1-159.1C441.3 257.4 447.1 241.2 447.1 224zM406.2 247.3l-158.9 158.9c-6.275 6.148-14.56 9.662-23.34 9.662c-8.785 0-17.07-3.514-23.34-9.662L41.79 247.3C35.64 241.1 32.13 232.8 32.13 224c0-8.785 3.516-17.07 9.664-23.34L200.7 41.79c6.275-6.148 14.56-9.662 23.34-9.662c8.785 0 17.07 3.514 23.34 9.662l158.9 158.9c6.15 6.275 9.664 14.56 9.664 23.34C415.9 232.8 412.4 241.1 406.2 247.3z'/%3E%3C/svg%3E")`,
          }}

*/
