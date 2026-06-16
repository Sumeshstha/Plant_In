import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/api_service.dart';

class ChatPage extends StatefulWidget {
  const ChatPage({super.key});

  @override
  State<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  final List<Map<String, String>> _messages = [
    {
      'role': 'assistant',
      'text': 'Hello Elena! I am your AI Virtual Botanist. How is your garden doing today? Feel free to ask me anything about care routines, dry soil, pest control, or yellowing leaves! 🌿'
    }
  ];

  final _textController = TextEditingController();
  final _scrollController = ScrollController();
  bool _isTyping = false;

  Future<void> _handleSendMessage() async {
    final query = _textController.text.trim();
    if (query.isEmpty) return;

    _textController.clear();
    setState(() {
      _messages.add({
        'role': 'user',
        'text': query,
      });
      _isTyping = true;
    });

    _scrollToBottom();

    try {
      // Build proper history formatting to feed our Gemini proxy
      final List<Map<String, String>> history = _messages
          .skip(1) // Skip the welcoming greeting for context simplicity
          .take(_messages.length - 1)
          .map((m) => {
                'role': m['role'] == 'user' ? 'user' : 'model',
                'message': m['text'] ?? '',
              })
          .toList();

      final responseObj = await ApiService.sendChatMessage(query, history);

      setState(() {
        _isTyping = false;
        if (responseObj['reply'] != null) {
          _messages.add({
            'role': 'assistant',
            'text': responseObj['reply'],
          });
        } else if (responseObj['message'] != null) {
          _messages.add({
            'role': 'assistant',
            'text': responseObj['message'],
          });
        } else {
          _messages.add({
            'role': 'assistant',
            'text': "I'm sorry, I had trouble parsing the response from the botany laboratory. Let's try again!",
          });
        }
      });
    } catch (e) {
      setState(() {
        _isTyping = false;
        _messages.add({
          'role': 'assistant',
          'text': "Oops! Connection error: Could not reach the botanical service. Please check your base URL.",
        });
      });
    }

    _scrollToBottom();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            const CircleAvatar(
              backgroundColor: Colors.green,
              child: Icon(Icons.psychology_outlined, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Botanical Advisor',
                  style: GoogleFonts.spaceGrotesk(fontSize: 15, fontWeight: FontWeight.bold),
                ),
                Text(
                  'Powered by Gemini AI',
                  style: GoogleFonts.inter(fontSize: 10, color: Colors.green),
                ),
              ],
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          // Chat Stream list
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length + (_isTyping ? 1 : 0),
              itemBuilder: (ctx, i) {
                // Return typing loader bubble
                if (i == _messages.length) {
                  return Align(
                    alignment: Alignment.centerLeft,
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.symmetric(horizontal: 16, py: 12),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade100,
                        borderRadius: const BorderRadius.only(
                          topRight: Radius.circular(20),
                          bottomLeft: Radius.circular(6),
                          bottomRight: Radius.circular(20),
                        ),
                      ),
                      child: Text(
                        'Botanist is thinking...',
                        style: GoogleFonts.inter(fontSize: 12, fontStyle: FontStyle.italic, color: Colors.grey),
                      ),
                    ),
                  );
                }

                final msg = _messages[i];
                final isUser = msg['role'] == 'user';

                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    maxWidth: MediaQuery.of(context).size.width * 0.8,
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.symmetric(horizontal: 16, py: 12),
                    decoration: BoxDecoration(
                      color: isUser
                          ? Theme.of(context).colorScheme.primary
                          : Theme.of(context).colorScheme.surfaceContainerHigh,
                      borderRadius: BorderRadius.only(
                        topLeft: const Radius.circular(20),
                        topRight: const Radius.circular(20),
                        bottomLeft: isUser ? const Radius.circular(20) : const Radius.circular(6),
                        bottomRight: isUser ? const Radius.circular(6) : const Radius.circular(20),
                      ),
                    ),
                    child: Text(
                      msg['text'] ?? '',
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        height: 1.4,
                        color: isUser ? Colors.white : Theme.of(context).colorScheme.onSurface,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          // User Input bar
          SafeArea(
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                border: Border(top: BorderSide(color: Theme.of(context).colorScheme.outlineVariant)),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _textController,
                      style: GoogleFonts.inter(fontSize: 13),
                      decoration: InputDecoration(
                        hintText: 'Ask your botanist...',
                        filled: true,
                        fillColor: Theme.of(context).colorScheme.surfaceContainerLow,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 20, py: 14),
                        border: OutlineInputBorder(
                          borderSide: BorderSide.none,
                          borderRadius: BorderRadius.circular(24),
                        ),
                      ),
                      textInputAction: TextInputAction.send,
                      onSubmitted: (_) => _handleSendMessage(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  GestureDetector(
                    onTap: _handleSendMessage,
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Theme.of(context).colorScheme.primary,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.send_rounded, color: Colors.white, size: 20),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
