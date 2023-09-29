import React from "react";
import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";
import Head from "next/head";


const HomePage = ({ meetups }) => {
  return (
    <React.Fragment>
      <Head>
        <title>meetups list</title>
        <meta title="description" content="Here all the meetups which you wanted to see!" />
      </Head>
      <MeetupList meetups={meetups} />
    </React.Fragment>
  );
};

export const getStaticProps = async () => {
  const client = await MongoClient.connect(
    "mongodb+srv://vikas:meetups@cluster0.hkt90qy.mongodb.net/?retryWrites=true&w=majority&appName=meetups"
  );

  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find().toArray();
  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        id: meetup._id.toString(),
        title: meetup.title,
        image: meetup.image,
        address: meetup.address,
        descriptiona: meetup.description,
      })),
      revalidate: 1,
    },
  };
};

export default HomePage;
