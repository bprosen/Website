import { Card, TextType } from '~/ui';

export const Intro = () => {
  return (
    <Card className='min-w-xl shadow-xl md:max-w-xl my-4 mx-12 sm:mx-2 md:mx-auto'>
      <div className='p-12 flex flex-col text-black text-2xl'>
        <p>Hey I'm Ben! It's great to meet you!</p>
        <div className='flex flex-row'>
          <p>I'm a passionate&nbsp;</p>
          <TextType
            className='underline underline-offset-4 decoration-2 text-bold'
            deletingSpeed={30}
            text={['Frontend', 'Backend', 'React', 'Java']}
            textColors={['#4720ff', '#4249fD', '#94249F', '#jfgwF89']}
            typingSpeed={60}
          />
          <div> Software Developer</div>
        </div>
      </div>
    </Card>
  );
};
