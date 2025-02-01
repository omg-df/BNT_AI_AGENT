import { db } from "./db/index.js";
import axios from "axios";

async function getAllDetailsByDeviceID(DeviceID) {
  try {
    const query = `SELECT HUI.role_role_id, ADDRESS.zipcode, UI.user_id, UI.email_id, UI.first_name, UI.last_name, HUI.home_details_home_id, HD.home_name, HD.area, HD.bedroom, HD.bathroom,HD.stories, RD.room_id, RD.room_name, RD.room_type, RDD.device_id 
      FROM public.user_info UI
      left join public.home_user_detail HUI on UI.user_id = HUI.user_info_user_id
      left join public.home_details HD on HD.home_id = HUI.home_details_home_id
      left join public.room_details RD on RD.home_details_home_id = HD.home_id
      left join public.room_device_details RDD on RD.room_id = RDD.room_details_room_id
        left join public.address ADDRESS on HD.address_address_id = ADDRESS.address_id where RDD.device_id = '${DeviceID}'`;

    const res = await db.query(query);
    // console.log(res.rows);

    return res.rows;
  } catch (err) {
    console.error("Error fetching Details:", err);
    throw err;
  }
}
// getAllDetailsByDeviceID("RS20X1087");

async function getAllDetailsByEmailID(emailID) {
  try {
    console.log("Inside getAllDetailsByEmailID");
    const query = `SELECT HUI.role_role_id, ADDRESS.zipcode, UI.user_id, UI.email_id, UI.first_name, UI.last_name, HUI.home_details_home_id, HD.home_name, HD.area, HD.bedroom, HD.bathroom,HD.stories, RD.room_id, RD.room_name, RD.room_type, RDD.device_id 
      FROM public.user_info UI
      left join public.home_user_detail HUI on UI.user_id = HUI.user_info_user_id
      left join public.home_details HD on HD.home_id = HUI.home_details_home_id
      left join public.room_details RD on RD.home_details_home_id = HD.home_id
      left join public.room_device_details RDD on RD.room_id = RDD.room_details_room_id
      left join public.address ADDRESS on HD.address_address_id = ADDRESS.address_id where UI.email_id = '${emailID}'`;

    const res = await db.query(query);
    console.log(res.rows);

    return res.rows;
  } catch (err) {
    console.error("Error fetching Details:", err);
    throw err;
  }
}
// getAllDetailsByEmailID("sedmed92@gmail.com");

async function getAllDetails() {
  try {
    const query = `SELECT HUI.role_role_id, ADDRESS.zipcode, UI.user_id, UI.email_id, UI.first_name, UI.last_name, HUI.home_details_home_id, HD.home_name, HD.area, HD.bedroom, HD.bathroom,HD.stories, RD.room_id, RD.room_name, RD.room_type, RDD.device_id 
      FROM public.user_info UI
      left join public.home_user_detail HUI on UI.user_id = HUI.user_info_user_id
      left join public.home_details HD on HD.home_id = HUI.home_details_home_id
      left join public.room_details RD on RD.home_details_home_id = HD.home_id
      left join public.room_device_details RDD on RD.room_id = RDD.room_details_room_id
      left join public.address ADDRESS on HD.address_address_id = ADDRESS.address_id`;

    const res = await db.query(query);
    // console.log(res.rows);

    return res.rows;
  } catch (err) {
    console.error("Error fetching Details:", err);
    throw err;
  }
}
// getAllDetailsByDeviceID();

async function getDeviceDetailsByDeviceID(DeviceID) {
  try {
    const res = await axios.post(
      "https://iotworkspace.broan-nutone.com/Thingworx/Things/Dashboard.Util/Services/GetDeviceDetails?Accept=application/json&Content-Type=application/json",
      { DeviceID },
      {
        headers: {
          "Content-Type": "application/json",
          appKey: process.env.JAVA_APP_KEY,
        },
      }
    );

    return res.data.rows[0];
  } catch (error) {
    console.log("Error fetching device details:");
  }
}
// getDeviceDetailsByDeviceID("RS20X1087");

async function getDeviceDataByDeviceID(DeviceID) {
  try {
    let res = await axios.post(
      "https://iotworkspace.broan-nutone.com/Thingworx/Things/Dashboard.Util/Services/GetDeviceDetails?Accept=application/json&Content-Type=application/json",
      { DeviceID },
      {
        headers: {
          "Content-Type": "application/json",
          appKey: process.env.JAVA_APP_KEY,
        },
      }
    );

    res = res.data.rows[0];
    let deviceData;

    deviceData = {
      CO2: res.CO2,
      Humidity: res.Humidity,
      Temperature: res.Temperature,
      LightIntensity: res.LightIntensity,
      TVOC: res.TVOC,
    };

    // console.log("DeviceData: ", deviceData);

    return deviceData;
  } catch (error) {
    console.log("Error fetching device details:", error);
  }
}
// getDeviceDataByDeviceID("WC20X1296");

export const TOOLS = {
  getAllDetailsByDeviceID: getAllDetailsByDeviceID,
  getDeviceDetailsByDeviceID: getDeviceDetailsByDeviceID,
  getAllDetails: getAllDetails,
  getAllDetailsByEmailID: getAllDetailsByEmailID,
  getDeviceDataByDeviceID: getDeviceDataByDeviceID,
};
