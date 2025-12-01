// Simple Timeline Video Service
export const getTimelineVideos = (topicTitle, courseName, dayNumber, topicIndex) => {
  console.log(`🎯 SIMPLE: Day ${dayNumber}, Topic ${topicIndex + 1}: "${topicTitle}"`);
  
  // SIMPLE: Day 1 = 0min, Day 2 = 5min, Day 3 = 10min, etc.
  const dayTimelineMinutes = (dayNumber - 1) * 5;
  // Add topic offset: Topic 1 = +0min, Topic 2 = +2min, etc.
  const topicOffsetMinutes = topicIndex * 2;
  
  const totalMinutes = dayTimelineMinutes + topicOffsetMinutes;
  const timelineSeconds = totalMinutes * 60;
  
  const videoId = getVideoIdForCourse(courseName);
  
  const videoUrl = timelineSeconds > 0 
    ? `https://www.youtube.com/watch?v=${videoId}&t=${timelineSeconds}s`
    : `https://www.youtube.com/watch?v=${videoId}`;
  
  console.log(`⏰ SIMPLE Timeline: Day ${dayNumber} = ${totalMinutes}min (${timelineSeconds}s)`);
  
  return [{
    id: `simple_${videoId}_${dayNumber}_${topicIndex}`,
    videoId: videoId,
    title: `Day ${dayNumber}: ${topicTitle}`,
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    duration: '25:30',
    url: videoUrl,
    embedUrl: `https://www.youtube.com/embed/${videoId}?start=${timelineSeconds}`,
    channel: getChannelForCourse(courseName),
    description: `Day ${dayNumber} - ${topicTitle}. Timeline: ${totalMinutes}min`,
    startTime: timelineSeconds,
    calculatedTime: timelineSeconds,
    timelineMinutes: totalMinutes,
    dayNumber: dayNumber,
    topicIndex: topicIndex,
    isSimpleTimeline: true
  }];
};

function getVideoIdForCourse(courseName) {
  const course = courseName.toLowerCase();
  
  if (course.includes('c') && course.includes('programming')) {
    return 'KJgsSFOSQv0'; // C Programming Tutorial
  }
  if (course.includes('javascript')) {
    return 'W6NZfCO5SIk'; // JavaScript Tutorial
  }
  if (course.includes('python')) {
    return 'rfscVS0vtbw'; // Python Tutorial
  }
  
  return 'KJgsSFOSQv0'; // Default programming tutorial
}

function getChannelForCourse(courseName) {
  const course = courseName.toLowerCase();
  
  if (course.includes('c')) return 'C Programming Academy';
  if (course.includes('javascript')) return 'JavaScript Mastery';
  if (course.includes('python')) return 'Python Academy';
  
  return 'Programming Academy';
}

export default { getTimelineVideos };