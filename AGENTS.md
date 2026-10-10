<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep scam-message analysis inside TanStack Start server functions so submitted text and Lovable AI credentials never enter the browser bundle; use the built-in AI Gateway for live analysis.
- Keep the landing experience in `src/routes/index.tsx` as the single interactive surface; the same live analysis response drives every threat-report detail so presentation enhancements never duplicate or simulate analysis data.
