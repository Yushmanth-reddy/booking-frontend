import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/searchContext";
import UseFetch from "../../hooks/UseFetch";
import "./reserve.css";

const URL = "http://localhost:8800/api";
export const Reserve = ({ setOpen, hotelId }) => {
  const [selectedItems, SetSelectedItems] = useState([]);
  const { data, loading, err } = UseFetch(`${URL}/hotels/room/${hotelId}`);
  const { date } = useContext(SearchContext);
  const navigate = useNavigate();

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const date = new Date(start.getTime());

    let list = [];

    while (date <= end) {
      list.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }
    return list;
  };

  const alldates = getDatesInRange(date[0].startDate, date[0].endDate);

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );
    return !isFound;
  };

  const handleSelect = (e) => {
    const value = e.target.value;
    const selected = e.target.checked;
    SetSelectedItems(
      selected
        ? [...selectedItems, value]
        : selectedItems.filter((item) => item !== value)
    );
  };
  const handleClick = async () => {
    try {
      await Promise.all(
        selectedItems.map((roomId) => {
          const res = axios.put(`${URL}/rooms/availability/${roomId}`, {
            dates: alldates,
          });
        })
      );
      setOpen(false);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <span>Select your rooms</span>
        {data.map((item, i) => (
          <div className="rItem" key={i}>
            <div className="rItemInfo">
              <div className="rTitle">{item.title}</div>
              <div className="rDesc">{item.desc}</div>
              <div className="rMax">
                Max people:<b>{item.maxPeople}</b>
              </div>
              <div className="rPrice">{item.price}</div>
            </div>
            {item.roomNumbers.map((roomNumber, index) => (
              <div className="room" key={index}>
                <label>{roomNumber.number}</label>
                <input
                  type="checkbox"
                  value={roomNumber._id}
                  onChange={handleSelect}
                  disabled={!isAvailable(roomNumber)}
                />
                {/* {console.log(roomNumber)} */}
              </div>
            ))}
          </div>
        ))}
        <button onClick={handleClick} className="rButton">
          Reserve Now
        </button>
      </div>
    </div>
  );
};
