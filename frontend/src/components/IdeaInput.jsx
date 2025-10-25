import React, { useState } from 'react';
import { Send } from 'lucide-react';

function IdeaInput({ api_url }) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${api_url}/ideas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: 'demo_user', text }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit idea');
      }
      setText('');
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="idea-input-container">
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          disabled={isSubmitting}
          rows={3}
        />
        <button type="submit" disabled={isSubmitting || !text.trim()}>
          <Send size={16} />
          {isSubmitting ? 'Adding...' : 'Add to Synapse'}
        </button>
      </form>
    </div>
  );
}

export default IdeaInput;
