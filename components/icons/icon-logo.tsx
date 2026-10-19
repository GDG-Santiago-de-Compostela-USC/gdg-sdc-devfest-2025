/**
 * Copyright 2020 Vercel Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement> & { backgroundColor?: string; foregroundColor?: string };

export default function IconLogo({
  backgroundColor = 'transparent',
  foregroundColor,
  ...props
}: Props) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 7.8 32 16.2"
      style={{ backgroundColor }}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g xmlns="http://www.w3.org/2000/svg" strokeWidth="1" stroke="none">
        <path
          fill={foregroundColor || '#4285f4'}
          d="m12.90592,18.88502l-8.7224,-5.03581c-0.39107,-0.22605 -0.81821,-0.33346 -1.23954,-0.33346c-0.85842,0 -1.69327,0.44566 -2.1533,1.24256c-0.68583,1.18797 -0.27887,2.70701 0.9091,3.39272l8.7224,5.03581c0.3912,0.22592 0.81821,0.33321 1.23954,0.33321c0.85842,0 1.69327,-0.44554 2.1533,-1.24231c0.68596,-1.18785 0.27887,-2.70689 -0.9091,-3.39272"
        />
        <path
          fill={foregroundColor || '#0f9d58'}
          d="m30.30016,13.84921l-8.7224,-5.03606c-0.39107,-0.22579 -0.81821,-0.33308 -1.23954,-0.33308c-0.85842,0 -1.69314,0.44529 -2.1533,1.24218c-0.68583,1.18797 -0.27874,2.70689 0.9091,3.39284l8.7224,5.03593c0.39107,0.22579 0.81821,0.33321 1.23954,0.33321c0.85842,0 1.69314,-0.44529 2.1533,-1.24231c0.68596,-1.18785 0.27887,-2.70676 -0.9091,-3.39272"
        />
        <path
          fill={foregroundColor || '#fbbc04'}
          d="m27.47098,18.74936l-4.07086,-2.35048l-4.3061,2.48601c-1.18785,0.68583 -1.59493,2.20499 -0.9091,3.39284c0.46004,0.79677 1.29501,1.24231 2.15343,1.24231c0.42133,0 0.84821,-0.10729 1.23941,-0.33321l7.01148,-4.04791c-0.3917,-0.05875 -0.77194,-0.18974 -1.11826,-0.38956"
        />
        <path
          fill={foregroundColor || '#ea4335'}
          d="m4.52896,13.25087l4.07098,2.35035l4.30598,-2.48613c1.18797,-0.68583 1.59506,-2.20487 0.9091,-3.39284c-0.68583,-1.18785 -2.20474,-1.59506 -3.39284,-0.9091l-7.01123,4.04804c0.39183,0.05888 0.77194,0.18986 1.118,0.38969"
        />
      </g>
    </svg>
  );
}
