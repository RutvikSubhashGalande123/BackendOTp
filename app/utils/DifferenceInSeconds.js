const diffInSeconds = (createdAt, updatedAt) => {
  var timeDifference = Math.abs(updatedAt.getTime() - createdAt.getTime());
  var timeDifferenceInSeconds = Math.ceil(timeDifference / 1000);
  return timeDifferenceInSeconds;
};

module.exports = diffInSeconds;
