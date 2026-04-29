"use client"

interface Player {
  name: string
  points: number
  id: string
}

interface LeaderBoardCardsList {
  players: Player[]
  userId: string
}

export default function LeaderBoardCards({ players, userId }: LeaderBoardCardsList) {
  //console.log(players);
  const getCardRankColor = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      return "bg-white text-blue-600 hover:bg-blue-50"
    }
    switch (rank) {
      case 0:
        return "bg-gradient-to-r from-yellow-200 to-yellow-400 hover:from-yellow-300 hover:to-yellow-500 hover:shadow-md hover:scale-[1.02] transition-all duration-200"
      case 1:
        return "bg-zinc-400 hover:bg-zinc-500 hover:shadow-md hover:scale-[1.02] transition-all duration-200"
      case 2:
        return "bg-gray-300 hover:bg-gray-500 hover:shadow-md hover:scale-[1.02] transition-all duration-200"
      default:
        return "bg-gradient-to-l from-custom-blue-3 to-custom-blue-1 hover:from-custom-blue-2 hover:to-custom-blue-1"
    }
  }

  const textColorCard = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      return "text-blue-600"
    }
    if (rank === 0 || rank === 1 || rank === 2) {
      return "text-black"
    } else {
      return "text-white"
    }
  }

  const getBorder = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      return "border-2 border-blue-500"
    }
    if (rank <= 2) {
      return ""
    } else {
      return "border border-white"
    }
  }

  const UserCard = (name: string) => {
    if (name == "You") {
      return "bg-white text-black"
    }
  }

  return (
    <div className="px-8 py-2 space-y-2">
      {players.map((player,key) => {
        const isCurrentUser = (player.id === userId);
        return (
          <div
            key={key}
            id={isCurrentUser ? "user-you" : undefined}
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer hover:shadow-md hover:scale-[1.02] duration-200 
            ${getCardRankColor(key, isCurrentUser)} ${getBorder(key, isCurrentUser)} 
            hover:shadow-md hover:scale-[1.02] transition-all duration-200`}
          >
            <span className={`text-lg font-semibold min-w-[24px] ${textColorCard(key, isCurrentUser)}`}>
              {key+1}
            </span>
            <span className={`flex-1 text-lg ${isCurrentUser ? "font-bold" : ""} ${textColorCard(key, isCurrentUser)}`}>
              {player.name}
            </span>
            <span className={`font-semibold ${textColorCard(key, isCurrentUser)}`}>
              {player.points}
            </span>
          </div>
        )
      })}
    </div>
  )
}
