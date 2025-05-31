import React, { useState, useEffect, useRef } from 'react';
import { Search, User, X } from 'lucide-react';
import { searchUsers } from '../../services/userService';
import { User as UserType } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface UserSearchInputProps {
  onUserSelect: (user: UserType) => void;
  selectedUser: UserType | null;
}

const UserSearchInput: React.FC<UserSearchInputProps> = ({ 
  onUserSelect, 
  selectedUser 
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current && 
        !resultsRef.current.contains(event.target as Node) && 
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length >= 2) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (searchQuery.trim() === '') return;
    
    setIsLoading(true);
    try {
      const users = await searchUsers(searchQuery);
      // Filter out current user
      const filteredUsers = users.filter(u => u.id !== user?.id);
      setSearchResults(filteredUsers);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectUser = (user: UserType) => {
    onUserSelect(user);
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const handleInputFocus = () => {
    if (searchQuery.length >= 2) {
      setShowResults(true);
    }
  };

  const handleClearSelected = () => {
    onUserSelect({} as UserType);
  };

  return (
    <div className="relative">
      {!selectedUser?.id ? (
        <>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-neutral-400" />
            </div>
            <input
              ref={inputRef}
              type="text"
              className="input pl-10"
              placeholder="Search for user by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleInputFocus}
            />
            {isLoading && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <div className="h-4 w-4 rounded-full border-2 border-t-primary-400 border-r-primary-400 border-b-transparent border-l-transparent animate-spin"></div>
              </div>
            )}
          </div>

          {showResults && searchResults.length > 0 && (
            <div 
              ref={resultsRef}
              className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="px-4 py-2 hover:bg-neutral-50 cursor-pointer"
                  onClick={() => handleSelectUser(user)}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-primary-100 text-primary-600 rounded-full w-8 h-8 flex items-center justify-center">
                      <span className="font-medium">{user.name.charAt(0)}</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-neutral-900">{user.name}</p>
                      <p className="text-xs text-neutral-500">{user.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showResults && searchQuery.length >= 2 && searchResults.length === 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg p-4 text-center">
              <p className="text-neutral-500">No users found</p>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center p-3 bg-neutral-50 rounded-md border border-neutral-200">
          <div className="flex-shrink-0 bg-primary-100 text-primary-600 rounded-full w-8 h-8 flex items-center justify-center">
            <User size={16} />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-neutral-900">{selectedUser.name}</p>
            <p className="text-xs text-neutral-500">{selectedUser.email}</p>
          </div>
          <button 
            onClick={handleClearSelected}
            className="ml-2 p-1 rounded-full hover:bg-neutral-200"
          >
            <X size={16} className="text-neutral-500" />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserSearchInput;