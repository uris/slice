import { Path } from '@/components/Path/Path';
import { H1, H2, P } from '@/components/Type/Type';
import css from './Overview.module.css';
import { OverviewBoard } from './OverviewBoard';

export default function Overview() {
	return (
		<div className={css.document}>
			<Path />
			<H1 id="title">Components in context</H1>
			<P clipWidth>
				A creative workspace, an everyday account, and a few good ideas. Explore Slice components working together in
				real UI.
			</P>
			<H2 id="examples" style={{ marginTop: 24, marginBottom: 12 }}>
				Everyday building blocks
			</H2>
			<p className={css.intro}>
				Try the controls, edit a project, or start a conversation. Forms and messages use local demo state. The voice
				demo connects live to OpenAI while you talk.
			</p>
			<OverviewBoard />
		</div>
	);
}
