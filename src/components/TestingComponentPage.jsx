import React, { useState } from "react";
import "../styles/Onboarding.css";
import StarPurple from "../images/StarPurple.svg";
import Testimonial from "./Testimonial";
import MoodTransition from "./MoodTransition";

const Onboarding = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const screens = [
    {
      title: (
        <>
          <img
            src={`${process.env.PUBLIC_URL}/brain.png`}
            alt="Header"
            className="brain-picture"
          />
          <span className="onboarding-title">Transform your career</span>
        </>
      ),
      content: (
        <>
          <p>Build confidence, reduce stress, achieve your goals.</p>
          <img
            src={`${process.env.PUBLIC_URL}/WelcomePicture.png`}
            alt="WelcomePicture"
            className="welcome-picture"
          />
        </>
      ),
    },
    {
      title: (
        <>
          <img src={StarPurple} alt="Star Purple" className="icon-onboarding" />
          <span className="onboarding-title">
            The #1 app for mindset and career growth
          </span>
        </>
      ),
      content: (
        <>
          <p>
            Built on principles endorsed by career coaches and mental health
            experts worldwide.
          </p>
          <Testimonial
            rating="⭐️⭐️⭐️⭐️⭐️"
            quote="This app is amazing! 10/10 would recommend."
            author="My mum"
          />
                    <p>
            This is a beta version, it will evolve!
          </p>
        </>
      ),
    },
    {
      title: (
        <div>
          <span className="onboarding-title">
            Unlock the power of manifesting your dream career
          </span>
        </div>
      ),
      content: (
        <>
          <p>
            Did you know that practicing positive affirmations daily can help
            rewire your brain to focus on opportunities instead of obstacles?
          </p>
          <MoodTransition />
        </>
      ),
    },
    /*{
      title: (
        <span className="onboarding-title">What brings you here today?</span>
      ),
      options: [
        "Boost my confidence",
        "Manage stress and find balance",
        "Stay motivated and focused",
        "Prepare for new opportunities",
        "Recognize and celebrate my skills",
        "Strengthen my work-life balance",
        "Just exploring",
      ],
    },
    /*{
      title: (
        <span className="onboarding-title">
          Which situation would describe you the best:
        </span>
      ),
      options: ["Unemployed", "Career Changer", "Employed", "Entrepreneur"],
    },
    {
      title: (
        <span className="onboarding-title">
          How satisfied are you with your career so far?
        </span>
      ),
      options: ["Very satisfied", "Neutral", "Unsatisfied", "Very Unsatisfied"],
    },*/
    {
      title: (
        <span className="onboarding-title">We’re here to help you succeed</span>
      ),
      content: (
        <>
          <img
            src={`${process.env.PUBLIC_URL}/ProgressGraph.png`}
            alt="ProgressGraph"
            className="welcome-picture"
          />
          <p>
            By engaging with carefully crafted affirmations daily, you’re
            training your mind to focus on strengths, embrace challenges, and
            stay resilient.
          </p>
        </>
      ),
    }
    /*{
      title: (
        <span className="onboarding-title">
          Choose how many affirmations you want to read each day
        </span>
      ),
      content: (
        <>
          <input type="range" min="5" max="50" defaultValue="25" />
          <p>Tap to start</p>
        </>
      ),
    },*/
  ];

  const handleNext = () => {
    setTransitioning(true);
    setTimeout(() => {
      setTransitioning(false);
      setCurrentScreen((prev) => Math.min(prev + 1, screens.length - 1));
    }, 500); // Matches the CSS transition duration
  };

  return (
    <div className="onboarding-container">
      {/* Progress Indicator */}
      <div className="progress-container">
        {screens.map((_, index) => (
          <div
            key={index}
            className={`progress-step ${
              index <= currentScreen ? "active" : ""
            }`}
          />
        ))}
      </div>

      <div
        className={`onboarding-screen ${
          transitioning ? "fade-out" : "fade-in"
        }`}
      >
        <h1>{screens[currentScreen].title}</h1>
        <div className="onboarding-content">
          {screens[currentScreen].content || (
            <ul>
              {screens[currentScreen].options.map((option, index) => (
                <li key={index}>{option}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="navigation">
          <button onClick={handleNext} className="next-button">
            {currentScreen === screens.length - 1 ? "Start" : "Next →"}
          </button>
          {screens[currentScreen].options && (
            <button onClick={handleNext} className="skip-button">
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
