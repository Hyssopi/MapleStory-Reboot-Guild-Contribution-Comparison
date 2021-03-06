
/**
 * Generates HTML for guild about.
 *
 * @return HTML code to generate guild about
 */
export default function()
{
  return `
    <div style="margin: 20px 0px 0px 10px; line-height: 2; font-size: 26px;">
      
      <div style="font-size: 40px; font-weight: bold;"><u>General</u></div>
      
      <div>* <span style="font-weight: bold;">GitHub Pages</span> link: <a href="https://hyssopi.github.io/MapleStory-Reboot-Guild-Contribution-Comparison/">https://hyssopi.github.io/MapleStory-Reboot-Guild-Contribution-Comparison/</a></div>
      
      <div>* Right click webpage -> Inspect -> Console, to view <b>debug</b> information.</div>
      
      <hr>
      
      <div style="font-size: 40px; font-weight: bold;"><u>Shortcuts</u></div>
      
      <div>* <b>Hide/Show</b> - Press <span style="font-weight: bold;">[h]</span> key to toggle whether to show all guilds or just default visible guilds. Does <span style="font-style: italic;">not</span> show all guilds by default.</div>
      
      <div>* <b>Reverse/Sort</b> - Press <span style="font-weight: bold;">[r]</span> or <span style="font-weight: bold;">[s]</span> keys to reverse <span style="font-weight: bold;">Data Table</span> data rows order. Switch between ascending order/oldest first (chronological order) or descending order/newest first (reverse chronological order).</div>
      
      <div>* <b>Line/Bar</b> - Press <span style="font-weight: bold;">[m]</span> key to switch between <i>line</i> or <i>bar</i> graphs in <span style="font-weight: bold;">Monthly Contribution Gained Graph</span>.</div>
      
      <hr>
      
      <div style="font-size: 40px; font-weight: bold;"><u>Details</u></div>
      
      <div>* <span style="font-weight: bold;">Summary - Trends</span> are estimates based on roughly the most recent month averages. Guild members with high contribution that leave or get expelled may temporarily affect the averages. These statistics are just for fun.</div>
      
      <div>* <span style="font-weight: bold;">Summary - Average (Most Recent Month)</span> calculations requires a valid entry at least one month prior to latest entry (regardless of invalid or valid) of any guild. In addition, the valid entry dates between the latest valid entry and the one month prior entry date must be greater than two weeks (to ensure enough data) but no more than 6 weeks (to ensure data is not too old).</div>
      
      <div>* <span style="font-weight: bold;">Monthly Contribution Gained Graph</span> calculations use the latest valid date of the month and the earliest valid date of the month and obtains an average contribution gained per day for that month for each guild. Then it uses the average to calculate an interpolated total contribution gained for that month. This is to cover the case where there are missing entries at the beginning or at the end of that month. In addition, there are checks in case the valid dates are too close (less than two weeks) or there are gaps (more than a week) in the beginning or end of the month.</div>
      
      <div>* <span style="font-weight: bold;">Honorable Rock</span> data obtained from in-game Honorable Rock at the end of the month. Note: In-game Honorable Rock data sometimes does not refresh until after a few days, so the data may be old by a few days.</div>
    </div>
  `;
}
