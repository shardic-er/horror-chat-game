import { ProgressFlag } from './gameTypes';
import { FunctionComponent, SVGProps } from 'react';

export interface ChatPartnerRequirements {
    visibilityFlag?: ProgressFlag;
    unlockFlags?: {
        flags: ProgressFlag[];
        operation: 'AND' | 'OR';
    };
}

export enum ModelType {
    gpt4 = 'gpt-4',
    gpt3_5 = 'gpt-3.5-turbo',
}

export interface ChatPartnerStyle {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
}

export interface ChatPartner {
    id: string;
    name: string;
    icon: FunctionComponent<SVGProps<SVGSVGElement>>;
    description: string;
    systemPrompt: string;
    model: ModelType;
    style: ChatPartnerStyle;
    requirements?: ChatPartnerRequirements;
    maxInputTokens: number;
    maxOutputTokens: number;
    temperature: number;
}