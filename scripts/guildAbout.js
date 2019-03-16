
/**
 * Generates HTML for guild about.
 *
 * @return HTML code to generate guild about
 */
export default function()
{
  return `
    <div style="margin: 20px 0px 0px 10px; line-height: 2; font-size: 26px;">
      <div>* <span style="font-weight: bold;">GitHub Pages</span> link: <a href="https://hyssopi.github.io/MapleStory-Reboot-Guild-Contribution-Comparison/">https://hyssopi.github.io/MapleStory-Reboot-Guild-Contribution-Comparison/</a></div>
      <div>* Guild data entries update at least <span style="font-style: italic;">weekly</span>.</div>
      <div>* Right click webpage -> Inspect -> Console, to view debug information.</div>
      <div>* Press <span style="font-weight: bold;">[r]</span> or <span style="font-weight: bold;">[s]</span> buttons to reverse <span style="font-weight: bold;">Data Table</span> data rows order. Switch between ascending order/oldest first (chronological order) or descending order/newest first (reverse chronological order).</div>
      <div>* <span style="font-weight: bold;">Summary - Trends</span> are estimates based on roughly the most recent month averages. Guild members with high contribution that leave or get expelled may temporarily affect the averages. These statistics are just for fun and not to be taken too seriously.</div>
      <div>* <span style="font-weight: bold;">Summary - Average (Most Recent Month)</span> calculations requires a valid entry at least one month prior to latest entry (regardless of invalid or valid) of any guild. In addition, the valid entry dates between the latest valid entry and the one month prior entry date must be greater than two weeks (to ensure enough data) but no more than 5 weeks (to ensure data is not too old).</div>
    </div>
  `;
}
