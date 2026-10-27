import { Construction } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/ui';

export const UnderConstruction: React.FC = () => {
  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <Card className='shadow-xl md:max-w-xl w-full'>
        <CardHeader>
          <CardTitle className='text-center text-2xl sm:text-3xl'>
            Hold on a second!
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col items-center gap-4'>
          <Construction
            className='w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[350px] md:h-[350px]'
            color='#e4ec75'
            strokeWidth={1.2}
          />
          <p className='text-base text-center'>
            This page is under construction, check back soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
