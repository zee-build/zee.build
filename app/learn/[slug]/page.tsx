import { notFound } from 'next/navigation';
import { createCourseServerClient } from '@/lib/course/supabase-server';
import { getModuleBySlug } from '@/lib/course/modules';
import { moduleContentRegistry } from '@/content/learn';
import ModuleShell from '@/components/learn/ModuleShell';
import AudienceToggle from '@/components/learn/AudienceToggle';
import GlossaryGrid from '@/components/learn/GlossaryGrid';
import ModuleInteractive from '@/components/learn/ModuleInteractive';

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createCourseServerClient();
  const courseModule = await getModuleBySlug(supabase, slug);

  if (!courseModule) notFound();

  const { data: { user } } = await supabase.auth.getUser();
  let status: 'not_started' | 'in_progress' | 'completed' = 'not_started';

  if (user) {
    const { data: progress } = await supabase
      .from('user_progress')
      .select('status')
      .eq('user_id', user.id)
      .eq('module_id', courseModule.module_id)
      .maybeSingle();
    if (progress) status = progress.status;
  }

  const content = moduleContentRegistry[slug];

  return (
    <ModuleShell module={courseModule} status={status}>
      {content ? (
        <>
          <AudienceToggle />
          <content.Body />
          <GlossaryGrid terms={content.glossary} />
          <ModuleInteractive
            moduleId={courseModule.module_id}
            quiz={content.quiz}
            passThreshold={courseModule.quiz_pass_threshold}
            nextSlug={courseModule.next_module_slug}
            initiallyPassed={status === 'completed'}
          />
        </>
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-8 text-center text-sm text-zinc-500">
          Module content coming soon.
        </div>
      )}
    </ModuleShell>
  );
}
