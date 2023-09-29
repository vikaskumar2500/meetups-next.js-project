"use client";

import React from "react";
import MeetupDetails from "../../components/meetups/MeetupDetails";
import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";

const DetailsPage = ({ meetup }) => {
  return (
    <React.Fragment>
      <Head>
        <title>{meetup.title}</title>
        <meta
          title="description"
          content="You can see your meetup details here!"
        />
      </Head>
      <MeetupDetails meetup={meetup} />
    </React.Fragment>
  );
};

export const getStaticPaths = async () => {
  const client = await MongoClient.connect(
    "mongodb+srv://vikas:meetups@cluster0.hkt90qy.mongodb.net/?retryWrites=true&w=majority&appName=meetups"
  );

  const db = client.db();
  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  const meetupsId = meetups.map((meetup) => meetup._id.toString());

  client.close();
  // const paramsIds = DUMMY_MEATUPS.map((meetup) => meetup.id);
  const paramsPaths = meetupsId.map((id) => ({
    params: {
      meetupId: id,
    },
  }));

  return {
    // added dynamics paths
    paths: paramsPaths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://vikas:meetups@cluster0.hkt90qy.mongodb.net/?retryWrites=true&w=majority&appName=meetups"
  );

  const db = client.db();
  const meetupsCollection = db.collection("meetups");

  const meetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetup: {
        id: meetup._id.toString(),
        title: meetup.title,
        image: meetup.image,
        address: meetup.address,
        description: meetup.description,
      },
    },
  };
};

export default DetailsPage;
