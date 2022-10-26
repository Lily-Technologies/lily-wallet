import DeadFlowerImage from 'src/assets/dead-flower.svg';

const NoUtxosEmptyState = () => (
  <div className='h-96 w-full space-y-6 flex flex-col items-center justify-center'>
    <h3 className='text-2xl text-gray-600 dark:text-gray-300 font-medium'>No UTXOs found</h3>
    <img className='w-24 h-24' src={DeadFlowerImage} />
    <p className='text-gray-600 dark:text-gray-400 font-sm font-medium'>
      No unspent transaction outputs match the search criteria.
    </p>
  </div>
);

export default NoUtxosEmptyState;
