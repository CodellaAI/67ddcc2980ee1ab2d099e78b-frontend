
import Tweet from './Tweet'

export default function TweetList({ tweets }) {
  if (!tweets || tweets.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No chirps to display
      </div>
    )
  }

  return (
    <div className="divide-y divide-extraLightGray">
      {tweets.map((tweet) => (
        <Tweet key={tweet._id} tweet={tweet} />
      ))}
    </div>
  )
}
