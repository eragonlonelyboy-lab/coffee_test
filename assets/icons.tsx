import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & {
    solid?: boolean;
};

const createIcon = (path: React.ReactNode, solidPath?: React.ReactNode): React.FC<IconProps> => {
    const IconComponent: React.FC<IconProps> = ({ solid = false, ...props }) => {
        const iconPath = solid && solidPath ? solidPath : path;
        const fill = solid ? 'currentColor' : 'none';
        const stroke = solid ? 'none' : 'currentColor';
        
        // Solid icons might not need a stroke width
        const strokeWidth = solid ? undefined : 1.5;

        return (
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill={fill} 
                viewBox="0 0 24 24" 
                strokeWidth={strokeWidth} 
                stroke={stroke} 
                {...props}
            >
              {iconPath}
            </svg>
        );
    };
    IconComponent.displayName = 'Icon';
    return IconComponent;
};


export const ArrowRightIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />);
export const CheckIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />);
export const ChevronLeftIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />);
export const ChevronRightIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />);
export const ChevronDownIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />);

export const CoffeeCupIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.25a3 3 0 013-3h4.5a3 3 0 013 3v6.75a3 3 0 01-3 3H8.25a3 3 0 01-3-3V5.25zm12.75 3a2.25 2.25 0 00-2.25-2.25H15v6.75h.75a2.25 2.25 0 002.25-2.25V8.25z" />);

export const DocumentTextIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />);
export const GiftIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />);
export const MinusIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />);
export const PencilIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />);
export const PlusIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />);
export const SparklesIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 15.75l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 21l-1.035.259a3.375 3.375 0 00-2.456 2.456L18 24.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 21l1.035-.259a3.375 3.375 0 002.456-2.456L18 15.75z" />);
export const TrashIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.144-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.057-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />);
export const UserIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />);
export const XMarkIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />);
export const ShoppingCartIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.838-5.514A1.875 1.875 0 0018.75 5.25H5.109m-2.862 0A1.875 1.875 0 002.25 7.125v.75" />);
export const ArrowPathIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.651c.336-.337.643-.69.923-1.056m-2.585-3.321c.643-.71 1.4-1.32 2.238-1.756m-2.238 1.756L6.985 19.644m9.038-10.296a8.25 8.25 0 01-11.667 0L2.985 9.348m11.667 0c.337.336.69.643 1.056.923m2.585 3.321c.71.643 1.32 1.4 1.756 2.238m-1.756-2.238L19.015 4.356" />);
export const ClockIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />);
export const XCircleIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />);
export const CheckCircleIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />);
export const ShieldCheckIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.4-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.4-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.4 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.4.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />);
export const UserPlusIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.5 21c-2.305 0-4.47-.612-6.374-1.666z" />);
export const SunIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />);
export const MoonIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />);
export const MagnifyingGlassIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />);
export const Bars3Icon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />);

export const FacebookIcon = createIcon(<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />);
export const TwitterIcon = createIcon(<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />);
export const InstagramIcon = createIcon(<><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></>);


// Icons that need a solid version
const starOutline = <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.321h5.367a.563.563 0 01.314.954l-4.341 3.188a.563.563 0 00-.182.635l1.634 5.033a.563.563 0 01-.84.625l-4.432-3.23a.563.563 0 00-.654 0l-4.432 3.23a.563.563 0 01-.84-.625l1.634-5.033a.563.563 0 00-.182-.635l-4.34-3.188a.563.563 0 01.314-.954h5.368a.563.563 0 00.475-.321L11.48 3.5z" />;
const starSolid = <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.543 2.868c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />;
export const StarIcon = createIcon(starOutline, starSolid);

const trophyOutline = <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 100-13.5h9a9.75 9.75 0 100 13.5zM16.5 18.75a9.75 9.75 0 000-13.5m0 13.5c2.653 0 5.132-.962 7.022-2.624m-14.044 2.624a9.72 9.72 0 01-7.022-2.624m0 0a9.72 9.72 0 010-10.752m14.044 10.752c1.9-1.662 3.022-3.957 3.022-6.476m-17.066 6.476c0-2.519 1.122-4.814 3.022-6.476M12 10.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75z" />;
const trophySolid = <path fillRule="evenodd" d="M15.16 2.6a1.1 1.1 0 01.84.4l1.32 1.33a1.1 1.1 0 010 1.55l-1.32 1.33a1.1 1.1 0 01-1.55 0L12 4.75l-2.33 2.33a1.1 1.1 0 01-1.55 0L6.79 5.88a1.1 1.1 0 010-1.55l1.33-1.33a1.1 1.1 0 011.55 0L12 4.75l2.32-2.32a1.1 1.1 0 011.55 0l-.7.7zM12 7.82l-3.07 3.08-3.08-3.08-2.52 2.52c-1.38 1.38-1.38 3.62 0 5l4.24 4.24c.78.78 2.05.78 2.83 0l4.24-4.24c1.38-1.38 1.38-3.62 0-5l-2.52-2.52L12 7.82z" clipRule="evenodd" />;
export const TrophyIcon = createIcon(trophyOutline, trophySolid);