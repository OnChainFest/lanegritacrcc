'use client';

/**
 * Winner Wallet Input Component
 *
 * Component for capturing and validating winner wallet addresses.
 * Can be used in tournament setup or when recording winners.
 */

import { useState, useEffect } from 'react';
import { isAddress } from 'viem';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Wallet } from 'lucide-react';
import { formatAddress } from '@/lib/wallet/config';

interface WinnerWalletInputProps {
  value: string;
  onChange: (address: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  winnerName?: string;
  className?: string;
}

export function WinnerWalletInput({
  value,
  onChange,
  label = 'Winner Wallet Address',
  placeholder = '0x...',
  required = false,
  disabled = false,
  winnerName,
  className = '',
}: WinnerWalletInputProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [touched, setTouched] = useState(false);

  // Validate address whenever value changes
  useEffect(() => {
    if (!value) {
      setIsValid(null);
      return;
    }

    const valid = isAddress(value);
    setIsValid(valid);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.trim();
    onChange(newValue);
    if (!touched) setTouched(true);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const showValidation = touched && value;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      <Label htmlFor={`wallet-input-${winnerName}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {winnerName && (
          <span className="ml-2 text-sm text-muted-foreground">
            ({winnerName})
          </span>
        )}
      </Label>

      {/* Input with validation indicator */}
      <div className="relative">
        <Input
          id={`wallet-input-${winnerName}`}
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`pr-10 font-mono text-sm ${
            showValidation
              ? isValid
                ? 'border-green-500 focus:ring-green-500'
                : 'border-red-500 focus:ring-red-500'
              : ''
          }`}
        />

        {/* Validation icon */}
        {showValidation && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValid ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
        )}
      </div>

      {/* Validation message */}
      {showValidation && (
        <>
          {isValid ? (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">
                Valid Ethereum address: {formatAddress(value, 6)}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Invalid Ethereum address. Please check and try again.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}

      {/* Helper text */}
      {!showValidation && (
        <p className="text-sm text-muted-foreground">
          Enter the winner's Ethereum wallet address (0x...)
        </p>
      )}
    </div>
  );
}

/**
 * Multiple Winners Wallet Input Component
 *
 * Component for capturing wallet addresses for multiple winners
 */

interface Winner {
  place: number;
  name: string;
  walletAddress: string;
}

interface WinnersWalletInputProps {
  winners: Winner[];
  onChange: (winners: Winner[]) => void;
  className?: string;
}

export function WinnersWalletInput({
  winners,
  onChange,
  className = '',
}: WinnersWalletInputProps) {
  const handleWalletChange = (index: number, address: string) => {
    const updatedWinners = [...winners];
    updatedWinners[index].walletAddress = address;
    onChange(updatedWinners);
  };

  const allWalletsValid = winners.every(
    (winner) => !winner.walletAddress || isAddress(winner.walletAddress)
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Winner Wallet Addresses</h3>
        {allWalletsValid && winners.every((w) => w.walletAddress) && (
          <span className="flex items-center text-sm text-green-600">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            All addresses valid
          </span>
        )}
      </div>

      <div className="space-y-4">
        {winners.map((winner, index) => (
          <WinnerWalletInput
            key={`winner-${index}`}
            value={winner.walletAddress}
            onChange={(address) => handleWalletChange(index, address)}
            label={`${winner.place}${getPlaceSuffix(winner.place)} Place`}
            winnerName={winner.name}
            required
          />
        ))}
      </div>

      {/* Summary */}
      <Alert>
        <Wallet className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Winners will receive their NFT trophies at
          these wallet addresses. Make sure they are correct before minting!
        </AlertDescription>
      </Alert>
    </div>
  );
}

/**
 * Helper to get place suffix
 */
function getPlaceSuffix(place: number): string {
  if (place === 1) return 'st';
  if (place === 2) return 'nd';
  if (place === 3) return 'rd';
  return 'th';
}
