export const getPlayersUserName = (players) => {
  return players.map(player => player.getUserName())
}