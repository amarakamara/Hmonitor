import React from "react";

export default function TextBody() {
  return (
    <div className="py-10  font-sans text-sm">
      <div className="px-6">
        <h1 className="font-extrabold text-xl mb-4 ">
          Know What you temperature and heartRate Level stands for:
        </h1>
        <p>
          These analysis are not medically very accurate, please consult a
          physician.
        </p>
        <div className="lg:pr-24 md:pr-24 text-justify">
          <h2 className="mt-4 mb-1 font-bold text-xl">Temperature:</h2>
          <p>
            Temperature is a fundamental indicator of health, and deviations
            from the norm can provide insight into underlying conditions.
          </p>
          <h4 className="font-semibold mt-2 mb-1">Low Temperature:</h4>
          <p>
            Temperature reading below 35°C may suggest hypothermia, a condition
            characterized by dangerously low body temperature, potentially
            leading to confusion, shivering, and drowsiness.
          </p>
          <h4 className="font-semibold  mt-2 mb-1">Normal Temperature:</h4>
          <p>
            Normal body temperature typically falls within a narrow range,
            indicating a balanced state of health. For most individuals, a
            temperature reading between 35°C and 38°C is considered normal.
          </p>
          <h4 className="font-semibold mt-2 mb-1">High Temperature:</h4>
          <p>
            A temperature exceeding 38°C could indicate fever, often a sign of
            infection or illness, prompting the body to elevate its temperature
            to combat pathogens
          </p>
          <hr className="border-t-2 my-4" />
          <h2 className="mt-4 mb-1 font-bold text-xl">Heart Rate:</h2>
          <p>
            Heart Rate, the measure of heartbeats per minute, offers valuable
            insights into cardiovascular health.
          </p>
          <h4 className="font-semibold mt-2 mb-1">Low Heart Rate:</h4>
          <p>
            heart rate below 60 beats per minute may signify bradycardia, where
            the heart beats slower than normal, possibly causing dizziness,
            fatigue, or fainting.
          </p>
          <h4 className="font-semibold mt-2 mb-1">Normal Heart Rate:</h4>
          <p>
            a normal heart rate reflects the heart's ability to pump blood
            effectively throughout the body, maintaining circulation and
            delivering oxygen and nutrients to vital organs. In adults, a heart
            rate between 60 and 100 beats per minute (bpm) is generally
            considered normal at rest
          </p>
          <h4 className="font-semibold mt-2 mb-1">High Heart Rate:</h4>
          <p>
            a heart rate surpassing 120 beats per minute could indicate
            tachycardia, characterized by a rapid heartbeat, potentially
            signaling stress, dehydration, or an underlying heart condition.
          </p>
        </div>
        <hr className="border-t-2 my-4" />
      </div>
      <div className="bg-teal-900 bg-opacity-15 rounded-md shadow-md px-6 py-4">
        <h1 className="font-extrabold text-2xl my-4">About HMonitor</h1>
        <p className="lg:pr-24 md:pr-24">
          Introducing HMonitor: Your Smart IoT Health Monitoring Solution.
          Harnessing the power of IoT technology, HMonitor ensures
          round-the-clock monitoring of vital physiological parameters including
          temperature and heart rate. Seamlessly collecting data from advanced
          sensors, our system processes and delivers real-time insights to
          empower users with proactive health management. Stay informed, stay
          healthy with HMonitor.
        </p>
      </div>
    </div>
  );
}
