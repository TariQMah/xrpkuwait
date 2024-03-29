import React, { useEffect, useMemo, useState } from "react";
import Lottie from "lottie-react";

import offlineAnimationData from "@/components/lottie/wired-flat-64-wifi-offline.json";
import ReactCountryFlag from "react-country-flag";

import inboundState from "@/components/lottie/wired-outline-33-arrow-down.json";
import outboundState from "@/components/lottie/wired-outline-34-arrow-up.json";

const usePeerData = () => {
  const column = useMemo(
    () => [
      "Public Key",
      "Country",
      "Version",
      "Server State",
      "Direction",
      "Latency",
      "Ledgers",
    ],
    []
  );

  const fakeObject = [1, 2, 3, 4].map((item: any, index: number) => {
    let obj = {
      node: `Node ${index + 1}`,
      pubkey: "-",
      ledger: "-",
      uptime: "-",
      version: "-",
      peers: "-",

      status: (
        <Lottie
          animationData={offlineAnimationData}
          loop={true}
          autoplay={true}
          style={{ width: 30, height: 30, margin: "0 auto" }}
        />
      ),
    };

    return obj;
  });

  const [peers, setPeers] = useState(fakeObject);

  const getData = async () =>
    fetch("https://xrpkuwait.com/peerinfo")
      .then((response) => response.json())
      .then((data: any) => {
        let modifyData = data?.map((item: any, index: any) => {
          let colors = {
            bg: "bg-[#32E685]",
            text: "text-[#0D793F]",
            border: "border-[#0D793F]",
          };

          if (item?.serverState === "insane") {
            colors = {
              bg: "bg-[#d9534f]",
              text: "text-black",
              border: "border-[#d9534f]",
            };
          } else if (item?.serverState === "unknown") {
            colors = {
              bg: "bg-[#f0ad4e]",
              text: "text-black",
              border: "border-[#f0ad4e]",
            };
          }

          return {
            pubkey: item?.pubkey,
            country: (
              <ReactCountryFlag
                key={item.pubkey}
                countryCode={item.country}
                svg
                title={item.country}
                style={{ width: 30, height: 30 }}
              />
            ),
            version: item?.version,
            serverState: (
              <div
                className={`${colors.bg} inline-block font-semibold ${colors.text} border ${colors.border} rounded-full px-5 py-2`}
              >
                {item?.serverState}
              </div>
            ),
            direction:
              item.direction == "inbound" ? (
                <Lottie
                  animationData={inboundState}
                  loop={true}
                  autoplay={true}
                  style={{ width: 30, height: 30, margin: "0 auto" }}
                />
              ) : (
                <Lottie
                  animationData={outboundState}
                  loop={true}
                  autoplay={true}
                  style={{ width: 30, height: 30, margin: "0 auto" }}
                />
              ),
            latency: item?.latency,
            ledgers: item?.ledgers || "N/A",
          };
        });
        setPeers(modifyData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

  useEffect(() => {
    const intervalId = setInterval(() => {
      getData();
    }, 1000); // 1000ms = 1 second

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return {
    peers,
    peersColumn: column,
  };
};

export default usePeerData;
