if (Meteor.isServer) {
  ServiceConfiguration.configurations.upsert(
    { service: "facebook" },
    {
      service: "facebook",
      appId: '458760144278793',
      secret: 'c9cef9f083a379276a6be7ab5242e595'
    }
  );
};

