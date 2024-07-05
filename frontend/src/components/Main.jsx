import React, { useEffect, useState } from "react";

export const Main = () => {
  const [data, setData] = useState(null);
  const [bestBuy, setBestBuy] = useState(null);
  const [bestSell, setBestSell] = useState(null);
  const [averagePrice, setAveragePrice] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:5000/tickers")
        .then((res) => res.json())
        .then((data) => {
          const tickers = data[0].tickers;
          setData(tickers);
          
          // Calculate Best Buy, Best Sell, and Average Price
          let total = 0;
          let buyPrices = [];
          let sellPrices = [];

          tickers.forEach(item => {
            const buyPrice = parseFloat(item.buy);
            const sellPrice = parseFloat(item.sell);
            buyPrices.push(buyPrice);
            sellPrices.push(sellPrice);
            total += parseFloat(item.last);
          });

          const bestBuyPrice = Math.min(...buyPrices);
          const bestSellPrice = Math.max(...sellPrices);
          const avgPrice = total / tickers.length;

          setBestBuy(bestBuyPrice);
          setBestSell(bestSellPrice);
          setAveragePrice(avgPrice);
        });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",").split(".0").join("");
  };

  return (
    <div className="bg-dark" style={{ fontFamily: "sans-serif" }}>
		  <div style={{ backgroundColor: "bg-dark", borderSpacing: "0 1em", borderCollapse: "separate",color:"white" }}>
              <p className="align-middle">Best price to trade</p>
           
              <h1 className="align-middle">₹{averagePrice !== null ? formatNumber(averagePrice.toFixed(2)) : "-"}</h1>
			  <p className="align-middle">Average BTC/INR include commission</p>
            
            </div>
      <div className="table-responsive">
        <table className="table text-white fw-bold fs-4 ">
          <thead className="text-secondary">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Platform</th>
              <th scope="col">Last</th>
              <th scope="col">Buy / Sell Price</th>
              <th scope="col">Difference</th>
              <th scope="col">Savings</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((item, i) => {
                const buyPrice = parseFloat(item.buy);
                const sellPrice = parseFloat(item.sell);
                const percentageChange = ((sellPrice - buyPrice) / buyPrice) * 100;
                const isGain = percentageChange > 0;
                const savings = sellPrice - buyPrice;
                const isProfit = savings > 0;

                return (
                  <tr
                    key={item._id}
                    style={{
                      backgroundColor: "#2e3241",
                      borderSpacing: "0 1em",
                      borderCollapse: "separate"
                    }}
                  >
                    <td className="align-middle">{i + 1}</td>
                    <td className="align-middle">{item.name}</td>
                    <td className="align-middle">₹{formatNumber(item.last)}</td>
                    <td className="align-middle">
                      ₹{formatNumber(item.buy)} / ₹{formatNumber(item.sell)}
                    </td>
                    <td
                      className="align-middle"
                      style={{ color: isGain ? "#add8e6." : "red" }}
                    >
                      {percentageChange.toFixed(2)}%
                      {isGain ? " " : " -"}
                    </td>
                    <td className="align-middle" style={{ color: isGain ? "#add8e6." : "red" }}>
                      {isGain ? " ▲" : " ▼"}₹{formatNumber(savings.toFixed(2))}
                    </td>
                  </tr>
                );
              })}
            <tr style={{ backgroundColor: "#2e3241", borderSpacing: "0 1em", borderCollapse: "separate" }}>
              <td className="align-middle">Best</td>
              <td className="align-middle">-</td>
              <td className="align-middle">-</td>
              <td className="align-middle">
                ₹{bestBuy !== null ? formatNumber(bestBuy.toFixed(2)) : "-"} / ₹{bestSell !== null ? formatNumber(bestSell.toFixed(2)) : "-"}
              </td>
              <td className="align-middle">-</td>
              <td className="align-middle">-</td>
            </tr>
          
          </tbody>
        </table>
      </div>
    </div>
  );
};
